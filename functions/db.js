import pg from 'pg';

/**
 * Database utility module for Cloudflare Hyperdrive with PostgreSQL
 * Provides a D1-like API interface for compatibility with existing code
 */

class HyperdriveClient {
  constructor(hyperdriveBinding) {
    this.hyperdrive = hyperdriveBinding;
    this.client = null;
  }

  /**
   * Get a PostgreSQL client from Hyperdrive
   */
  async getClient() {
    if (this.client) {
      return this.client;
    }
    
    // Connect using Hyperdrive connection string
    const connectionString = this.hyperdrive.connectionString;
    this.client = new pg.Client({ connectionString });
    await this.client.connect();
    return this.client;
  }

  /**
   * Prepare a SQL statement (D1-like interface)
   */
  prepare(sql) {
    return new Statement(this, sql);
  }

  /**
   * Execute multiple statements in a batch (D1-like interface)
   */
  async batch(statements) {
    const client = await this.getClient();
    const results = [];
    
    try {
      for (const stmt of statements) {
        const result = await stmt.execute(client);
        results.push({ results: result.rows });
      }
      return results;
    } finally {
      await this.releaseClient(client);
    }
  }
}

class Statement {
  constructor(client, sql) {
    this.client = client;
    this.sql = sql;
    this.params = [];
  }

  /**
   * Bind parameters to the statement
   */
  bind(...params) {
    this.params = params;
    return this;
  }

  /**
   * Execute the statement and return all results
   */
  async all(client = null) {
    const actualClient = client || await this.client.getClient();
    const shouldRelease = !client;
    try {
      const result = await actualClient.query(this.sql, this.params);
      return { results: result.rows };
    } finally {
      if (shouldRelease) {
        await this.client.releaseClient(actualClient);
      }
    }
  }

  /**
   * Execute the statement and return first result
   */
  async first(client = null) {
    const actualClient = client || await this.client.getClient();
    const shouldRelease = !client;
    try {
      const result = await actualClient.query(this.sql, this.params);
      return result.rows[0] || null;
    } finally {
      if (shouldRelease) {
        await this.client.releaseClient(actualClient);
      }
    }
  }

  /**
   * Execute the statement and return run results
   */
  async run(client = null) {
    const actualClient = client || await this.client.getClient();
    const shouldRelease = !client;
    try {
      const result = await actualClient.query(this.sql, this.params);
      return { 
        results: result.rows,
        meta: {
          changes: result.rowCount || 0
        }
      };
    } finally {
      if (shouldRelease) {
        await this.client.releaseClient(actualClient);
      }
    }
  }

  /**
   * Execute the statement (internal method for batch operations)
   */
  async execute(client) {
    const result = await client.query(this.sql, this.params);
    return result;
  }
}

/**
 * Release the client back to the pool
 */
HyperdriveClient.prototype.releaseClient = async function(client) {
  if (this.client === client) {
    this.client = null;
    await client.end();
  }
};

/**
 * Create a Hyperdrive database client from the context
 */
export function createDbClient(context) {
  if (!context.env.BTD6_INDEX_DB) {
    throw new Error('BTD6_INDEX_DB binding not found in context.env');
  }
  return new HyperdriveClient(context.env.BTD6_INDEX_DB);
}