import algoliasearch from "algoliasearch"
import * as dotenv from 'dotenv';
dotenv.config()

const client = algoliasearch('IS2TBU3SEV', `${process.env.ALGOLIA_USER}`)
export const index = client.initIndex('Pets')