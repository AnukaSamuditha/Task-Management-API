import { createRequire } from "module";
import config from './app/configs/dbConfig.js';

const require = createRequire(import.meta.url);
const { Umzug, SequelizeStorage } = require('umzug');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize(config.development);

export const migrator = new Umzug({
	migrations: {
		glob: ['./migrations/*.{ts,js,cjs,mjs}', { cwd: path.dirname(import.meta.url.replace('file:///', '')) }],
		resolve: (params:any) => {
			if (params.path.endsWith('.mjs') || params.path.endsWith('.js')) {
				const getModule = () => import(`file:///${params.path.replace(/\\/g, '/')}`)
				return {
					name: params.name,
					path: params.path,
					up: async (upParams:any) => (await getModule()).up(upParams),
					down: async (downParams:any) => (await getModule()).up(downParams),
				}
			}
			return {
				name: params.name,
				path: params.path,
				...require(params.path),
			}
		}
	},
	context: { sequelize, DataTypes },
	storage: new SequelizeStorage({
		sequelize,
	}),
	logger: console,
});


migrator.runAsCLI()