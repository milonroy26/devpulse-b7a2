import { pool } from "../../../config/db";
import type { IIssue } from "./issue.interface";

//? create issue
const createIssueIntoDB = async (issueData: (IIssue)): Promise<IIssue> => {
    const { title, description, type, reporter_id } = issueData;

    //? title and description length check
    if (title.length > 150) {
        const error = new Error("Validation Error") as any;
        error.statusCode = 400;
        error.errrrs = "Title cannot be exceed 150 characters.";
        throw error;
    }

    if (description.length < 20) {
        const error = new Error("Validation Error") as any;
        error.statusCode = 400;
        error.errrrs = "Description cannot be less than 20 characters long.";
        throw error;
    }

    //? type check -> bug or feature
    if (type !== 'bug' && type !== 'feature_request') {
        const error = new Error("Validation Error") as any;
        error.statusCode = 400;
        error.errors = "Type must be either 'bug' or 'feature_request'.";
        throw error;
    }

    //? insert data into database
    const query = `
        INSERT INTO issues (title, description, type, reporter_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id, title, description, type, status, reporter_id, created_at, updated_at;
    `;

    const values = [title, description, type, reporter_id];
    const result = await pool.query(query, values);

    return result.rows[0];
}

//? get all issues
const getAllIssuesFromDB = async (filters: { status?: string; type?: string; search?: string }) => {
    const { status, type, search } = filters;

    let query = `SELECT id, title, description, type, status, reporter_id, created_at, updated_at FROM issues WHERE 1=1`;
    const values: any[] = [];
    let counter = 1;

    //? status filter
    if (status) {
        query += ` AND status = $${counter}`;
        values.push(status);
        counter++;
    }

    //? type filter
    if (type) {
        query += ` AND type = $${counter}`;
        values.push(type);
        counter++;
    }

    //? search filter
    if (search) {
        query += ` AND (title ILIKE $${counter} OR description ILIKE $${counter})`;
        values.push(`%${search}%`);
        counter++;
    }

    //? new issue first
    query += ` ORDER BY created_at DESC;`;

    const issueResult = await pool.query(query, values);
    const issues = issueResult.rows;

    //? if no issues return empty array
    if (issues.length === 0) {
        return [];
    }

    //? Create an array of unique reporter_ids from all issues
    const reporterIds = [...new Set(issues.map((issue) => issue.reporter_id))];

    //? Fetching data from all reporters at once with a batch query
    const placeholders = reporterIds.map((_, index) => `$${index + 1}`).join(', ');
    const userQuery = `SELECT id, name, role FROM users WHERE id IN (${placeholders})`;

    const userResult = await pool.query(userQuery, reporterIds);
    const users = userResult.rows;

    //? Create a map of reporter_id to user object
    const userMap = users.reduce((acc: any, user: any) => {
        acc[user.id] = user;
        return acc;
    }, {});

    //? Now we loop through the issues and replace reporter_id with the reporter object 
    const formattedIssues = issues.map((issue) => {
        const { reporter_id, ...restOfIssue } = issue;

        return {
            ...restOfIssue,
            reporter: userMap[reporter_id] || null,
        };
    });

    return formattedIssues;

}

//? get single issue
const getSingleIssueFromDB = async (id: string) => {

    //? database query
    const query = `
        SELECT id, 
        title, 
        description, 
        type, 
        status, 
        reporter_id, 
        created_at, 
        updated_at 
        FROM issues WHERE id = $1    
    `;
    const result = await pool.query(query, [id]);
    const issue = result.rows[0];

    //? if no issue is found with this ID
    if (!issue) {
        const error = new Error("Resource Not found") as any;
        error.statusCode = 404;
        error.errors = `Issue with Id &{id} not exist.`;
        throw error;
    }

    //? Issue reporter data
    const userQuery = `
        SELECT id, name, role FROM users WHERE id = $1
    `;
    const userResult = await pool.query(userQuery, [issue.reporter_id]);
    const user = userResult.rows[0];

    //? replace reporter_id with user object
    const { reporter_id, ...restOfIssue } = issue;
    const formattedIssue = {
        ...restOfIssue,
        reporter: user || null,
    };

    return formattedIssue;
}

//? update issue
const updateIssueStatusInDB = async (id: string, status: string) => {

    //? Input status validation
    const validStatuses = ['open', 'in_progress', 'resolved'];
    if (!validStatuses.includes(status)) {
        const error = new Error("Validation Error") as any;
        error.statusCode = 400;
        error.errors = `Invalid status. Allowed values are: ${validStatuses.join(', ')}`;
        throw error;
    }

    //? Check if the issue is in the database by ID
    const checkQuery = `SELECT id FROM issues WHERE id = $1`;
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
        const error = new Error("Resource Not Found") as any;
        error.statusCode = 404;
        error.errors = `Issue with ID ${id} does not exist.`;
        throw error;
    }

    //? Update the issue
    const updateQuery = `
        UPDATE issues 
        SET status = $1, 
        updated_at = NOW() 
        WHERE id = $2
        RETURNING id, title, description, type, status, reporter_id, created_at, updated_at;
    `;

    const result = await pool.query(updateQuery, [status, id]);
    return result.rows[0];
};

export const IssueServices = {
    createIssueIntoDB,
    getAllIssuesFromDB,
    getSingleIssueFromDB,
    updateIssueStatusInDB,
};