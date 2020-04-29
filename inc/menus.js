const connection = require('./db');
let path = require('path');

//metodo para trazer as fotos do meu banco de dados
module.exports = {

    getMenus(){
        return new Promise((resolve, reject)=> {

            connection.query("SELECT * FROM `tb_menus` ORDER BY title", (err, results)=> {

                if(err){

                    reject("ERROR: ", err);

                }

                resolve(results);

            });

        });
    },

    save(fields, files){

        return new Promise((resolve, reject)=> {

            fields.photo = `images/${path.parse(files.photo.path).base}`;

            let query,queryPhoto = '', params = [

                fields.title,
                fields.description,
                fields.price,
            ];

            if(files.photo.name){

                queryPhoto = `,photo = ?`
                params.push(fields.photo)

            }

            if(fields.id > 0){

                params.push(fields.id)

                query = `
                    UPDATE tb_menus SET 
                    title = ?,
                    description = ?,
                    price = ?
                    ${queryPhoto}
                    WHERE id = ?
                `;

            }else{
                if(!files.photo.name){

                    reject("Envie a foto do prato");

                }

                query = `
                INSERT INTO tb_menus (title, description, price, photo) 
                VALUES(?, ?, ?, ?)
                `;

               /* params = [

                    fields.title,
                    fields.description,
                    fields.price,
                    fields.photo

                  ]*/

            }

            connection.query( query, params, (err, results)=> {
                
                if(err){
                    reject(err);
                }else{
                    resolve(results);
                }
              }) 
        });

    },

    delete(id){

        return new Promise((resolve, reject)=> {

            connection.query(`
                DELETE FROM tb_menus WHERE id = ?    
            `, [
                id
               ],(err, results)=> {

                    if(err){

                        reject(err)

                    }else{

                        resolve(results);
                        console.log("ERROR: ", err);
                    }

               }
            )

        });

    }

};