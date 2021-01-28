export interface Config {
  token: string;
  college: College;
  database: Database;
}

export interface College {
  shortName: string;
  fullName: string;
}

export interface Database {
  connectionUrl: string;
}
