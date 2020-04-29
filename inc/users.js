let connection = require('./db');

module.exports = {

    render(req, res, error){

        res.render('admin/login', {
            body: req.body,
            error
        });

    },

    login(email, password){

       return new Promise((resolve, reject)=> {

            connection.query(`
                SELECT * FROM tb_users WHERE email = ?`,
                [
                    email             
                ],(err, results)=> {

                    if(err){

                        reject(err);

                    }else{
                        //se nao tiver nenhuma linha
                        if(!results.length > 0){

                            reject("Usuario ou senha incorretos");

                        }else{

                            //para retornar apenas uma linha
                        let row = results[0];

                        if(row.password !==  password){

                            reject("Usuario ou senha incorretos");

                        }else{

                            resolve(row);

                        }

                        }

                    }

                }
            );

        });

    },
    
    getUsers(){
        return new Promise((resolve, reject)=> {

            connection.query("SELECT * FROM `tb_users` ORDER BY name", (err, results)=> {

                if(err){

                    reject("ERROR: ", err);

                }

                resolve(results);

            });

        });
    },

    save(fields){

        return new Promise((resolve, reject)=> {

            let query,queryPhoto = '', params = [

                fields.name,
                fields.email,

            ];

            if(parseInt(fields.id) > 0){

                params.push(fields.id);

                query = `
                    UPDATE tb_users SET 
                    name = ?,
                    email = ?
                    WHERE id = ?
                `;

            }else{
                query = `
                INSERT INTO tb_users (name, email, password) 
                VALUES(?, ?, ?)
                `;

                params.push(fields.password);

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
                DELETE FROM tb_users WHERE id = ?    
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

    },

    changePassword(req){

        return new Promise((resolve, reject)=>{

            if(!req.fields.password){
                reject('Preencha a senha');
            } else if(req.fields.password !== req.fields.passwordConfirm){
                reject('comfirme a senha corretamente');
            }else{

                connection.query(`
                    UPDATE tb_users 
                    SET password = ? 
                    WHERE id = ?  
                `, [
                    req.fields.password,
                    req.fields.id
                   ],(err, results)=> {

                        if(err){
                            reject(err.message);
                            console.log("ERROR: ", err);
                        }else{

                            resolve(results);

                        }

                   }
                )

            }

        });


    }

};