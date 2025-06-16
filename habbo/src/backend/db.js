import {Sequelize} from 'sequelize';
import { join, resolve } from 'path';


export const DB= new Sequelize(
    {
        dialect:'sqlite',
        storage:join(process.cwd(),'database.sqlite')
    }
)