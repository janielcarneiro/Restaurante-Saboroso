var connection = require('./db');

module.exports = {

    render(req, res, error, success){

        res.render('contact', {

            title: 'Contact',
            background: 'images/img_bg_3.jpg',
            h1: 'Diga ola',
            autor: "Janiel Carneiro Lima",
            body: req.body,
            error,
            success
          });

    }, 

    save(fields){

        return new Promise((resolve,reject)=> {

            connection.query(`
            INSERT INTO tb_contacts (name, email, message) 
            VALUES(?,?,?) `,
        [
            fields.name,
            fields.email,
            fields.message
        ],(error, results)=> {

            if(error){

                console.log("ERROR AO CONECTAR NO BANCO DE DADOS: ",error);

            }else{

                resolve(results);

            }

        }
        
        )

        });

    }, 

    getContacts(){

        return new Promise((resolve, reject)=> {

            connection.query(`SELECT * FROM tb_contacts ORDER BY register
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

            connection.query(`DELETE FROM tb_contacts WHERE id = ?
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

};