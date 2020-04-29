var connection = require('./db');

module.exports = {


    save(req){

        return new Promise((resolve, reject)=> {


            if(!req.fields.email){
                reject("Preenha o seu email vagabundo")
            }else{
                
            connection.query(`INSERT INTO tb_emails (email) VALUES(?)`,
            [
                req.fields.email
            ],
            (error, results)=> {
                if(error){

                    reject(error.message)
    
                }else{
    
                    resolve(results);
    
                }
    

            }
            )
        }

        })

    },
    getEmails(){

        return new Promise((resolve, reject)=> {

            connection.query(`SELECT * FROM tb_emails ORDER BY id
            `,(err, results)=> {

                if(err){

                    reject(err);

                }else{

                    resolve(results);

                }
            })

        })

    },

    delete(id){

        return new Promise((resolve, reject)=> {

            connection.query(`DELETE FROM tb_emails WHERE id = ?
            `,[
                id
            ],(err, results)=> {

                if(err){

                    reject(err)

                }else{

                    resolve(results);

                }
            }

            )

        })

    }

}