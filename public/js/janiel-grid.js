class janielGrid {

    constructor(configs){

        configs.listerners = Object.assign({}, {
            afterUpdateClick: (e)=>{

                console.log('Depois do click');
                $('#modal-update').modal('show');
      
              },

              afterDeleteClick: (e)=>{

                window.location.reload();
      
              },
              afterFormCreate: (e)=> {

                window.location.reload();

              },
              afterFormUpdate: (e)=> {

                window.location.reload();

              },
              afterFormCreateError: (e)=> {

                  alert("Não foi possivel enviar o formulario");

              },
              afterFormUpdateError: (e)=> {

                alert("Não foi possivel atualizar o cadastro")

              },
              buttonClick:(btn, data, e)=> {

                document.querySelector('#modal-update-password form [name=id]').value = data.id;
                //console.log('dados: ', btn, data, e);
      
              }
          
        }, configs.listerners);

        this.options = Object.assign({}, {
            formCreate: "#modal-create form",
            formUpdate: '#modal-update form',
            btnUpdate: 'btn-update',
            btnDelete: "btn-delete",
            onUpdateLoad: (form, name, data) => {

              let input = form.querySelector('[name=' + name + ']');

              if(input) input.value = data[name];


            }
        },configs);

        this.rows = [...document.querySelectorAll('table tbody tr')];
        this.initForms();
        this.initBtn();

    }

    initForms(){

        this.formCreate = document.querySelector(this.options.formCreate);

        if(this.formCreate){
        this.formCreate.save({
          success:()=> {
            this.fireEvent('afterFormCreate')
          },
          failure:()=>{
            this.fireEvent('afterFormCreateError');      
          }
        })

      }
  
        //para selecionar o meu campo
        this.formUpdate = document.querySelector(this.options.formUpdate);
  
        if(this.formUpdate){

        this.formUpdate.save({
          success:()=> {
            this.fireEvent('afterFormUpdate');
          }, 
          failure:()=> {
            this.fireEvent('afterFormUpdateError');
          }
        })
      }

    }
    //Evento de fogo
    fireEvent(name, args){

      if(typeof(this.options.listerners[name]) === 'function'){

        this.options.listerners[name].apply(this, args);

      }

    }

    getTrData(e){

      var tr =  e.path.find(el => {
  
        return (el.tagName.toUpperCase() === 'TR')

      });

      return JSON.parse(tr.dataset.row);

    }

    btnUpdateClick(e){
  
      this.fireEvent('beforeUpdateClick', [e]);

       let data = this.getTrData(e);

        for(let name in data){

          this.options.onUpdateLoad(this.formUpdate, name, data);


        }

        this.fireEvent('afterUpdateClick', [e]);

    }

    btnDeleteClick(e){
 
      this.fireEvent('beforeDeleteClick');

      let data =  this.getTrData(e);

      if(confirm(eval('`' +this.options.deleteMsg +'`'))){

         return fetch(eval('`' + this.options.deleteUrl + '`'), {
            method: 'DELETE'
          })
          .then(response => response.json())
          .then(json => {

              this.fireEvent('afterDeleteClick');
             // window.location.reload();
              console.log("JSON: ", json);
              
          });
    }

    }

    initBtn(){

        this.rows.forEach(row => {

         [...row.querySelectorAll('.btn')].forEach(btn => {

            btn.addEventListener('click', e => {

              //console.log(e.target.classList);
              //console.log(this.options.btnUpdate);
              //console.log(e.target)

              if(e.target.classList.contains(this.options.btnUpdate)){

                  this.btnUpdateClick(e);

              } else if(e.target.classList.contains(this.options.btnDelete)){

                  this.btnDeleteClick(e);

              }else{

                this.fireEvent('buttonClick', [e.target, this.getTrData(e), e]);

              }

            });

          });

        });
   
       /* [...document.querySelectorAll(this.options.btnUpdate)].forEach(btn => {
  
            btn.addEventListener('click', e=> {
  
            this.fireEvent('beforeUpdateClick', [e]);


           let data = this.getTrData(e);
           /* var tr =  e.path.find(el => {
  
                return (el.tagName.toUpperCase() === 'TR')
  
              });
  
            let data = JSON.parse(tr.dataset.row);
  
            console.log(data);*/
  
           /* for(let name in data){
  
              this.options.onUpdateLoad(this.formUpdate, name, data);

              /*let input = this.formUpdate.querySelector(`[name=${name}]`);
  
              switch (name) {
              
                case 'date':
  
                if(input) input.value = moment(data[name]).format("YYYY-MM-DD");
                  console.log(moment(data[name]).format("YYYY-MM-DD"));
                  
                break;
  
                default:
                
                    if(input) input.value = data[name];
                  
                break;
                
              }
  
            }
  
            this.fireEvent('afterUpdateClick', [e]);
            });
  
  });*/
  
  
  
      /*[...document.querySelectorAll(this.options.btnDelete)].forEach(btn => {
  
            btn.addEventListener('click', e => {
  
              this.fireEvent('beforeDeleteClick');


              let data =  this.getTrData(e);
              /*let tr =  e.path.find(el => {
  
                  return (el.tagName.toUpperCase() === 'TR');
  
                });
  
                let data = JSON.parse(tr.dataset.row);
                console.log(data.id);
  
              if(confirm(eval('`' +this.options.deleteMsg +'`'))){
  
                 return fetch(eval('`' + this.options.deleteUrl + '`'), {
                    method: 'DELETE'
                  })
                  .then(response => response.json())
                  .then(json => {
  
                      this.fireEvent('afterDeleteClick');
                     // window.location.reload();
                      console.log("JSON: ", json);
                      
                  })
  
      }
  
       });
  
      });*/

    }

}