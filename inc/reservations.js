var connection = require('./db');
var Pagination = require('./../inc/Pagination');
var moment = require('moment');

module.exports = {

    render(req,res, error, success){

        res.render('reservation', {

            title: 'reservation',
            background: 'images/img_bg_2.jpg',
            h1: 'Reservas',
            autor: "Janiel Carneiro Lima",
            body: req.body,
            error,
            success     
          });
    },

    save(fields){

        return new Promise((resolve, reject)=> {

            if(fields.date.indexOf('/') > -1){

                //formatar a data
               let date = fields.date.split('/');
               fields.date = `${date[2]}-${date[1]}-${date[0]}`;

            }

            let query, params = [
                fields.name,
                fields.email,
                fields.people,
                fields.date,
                fields.time
            ];

            if(parseInt(fields.id)  > 0){

                query = `
                    UPDATE tb_reservations 
                    SET
                        name = ?,
                        email = ?,
                        people = ?,
                        date = ?,
                        time = ?
                      WHERE id = ?
                `;
                params.push(fields.id);
                //console.log("TAKI MEU ID do PUT")
            }else{

                query = `
                INSERT INTO tb_reservations (name, email, people, date, time)
                VALUES(?, ?, ?, ?, ?)
                `
                //console.log("TAKI MEU ID do POST")
                //console.log(fields.id);
            }

            connection.query(query, params, (error,results)=> {

                if(error){

                    reject("ERROR AO CONECTAR NO BANCO DE DADOS: ",error);

                }else{

                    resolve(results);

                }

            });

        });

    },

    getReservations(req){

        return new Promise((resolve, reject)=> {

        let page = req.query.page;
        let dtstart = req.query.start;
        let dtend = req.query.end;

        if(!page) page = 1;

        let params = [];

        if(dtstart && dtend) params.push(dtstart, dtend)

        let pag = new Pagination(
            `SELECT SQL_CALC_FOUND_ROWS * 
            FROM tb_reservations 
            ${(dtstart && dtend) ? 'WHERE date BETWEEN ? AND ?' : '' }
            ORDER BY name LIMIT ?, ?`,
            
               params
            
        );

        pag.getPage(page).then(data => {

            resolve({
                data,
                links : pag.getNavigation(req.query)
            })

        }).catch(err => {

            console.log("ERROR: ", err);

        })

        })

    },  

    delete(id){

        return new Promise((resolve, reject)=> {

            connection.query(`
                DELETE FROM tb_reservations WHERE id = ?    
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

    dashboard(){

        return new Promise((resolve, reject)=> {

            connection.query(`
            SELECT 
            (SELECT COUNT(*) FROM tb_contacts) AS nrcontacts,
            (SELECT COUNT(*) FROM tb_menus) AS nrmenus,
            (SELECT COUNT(*) FROM tb_reservations) AS nrreservations,
            (SELECT COUNT(*) FROM tb_users) AS nrusers;  
            `,(err, results)=> {
                
                if(err){

                    console.log("ERROR ao conectar com o banco de dados");
                    reject(err);

                }else{

                    resolve(results[0]);

                }

            })

        });

    },

};