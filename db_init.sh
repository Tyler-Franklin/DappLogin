npx sequelize-cli init
npx sequelize-cli model:generate --name userinfo --attributes address:string,depositAmount:string
npx sequelize-cli db:migrate

