HTMLFormElement.prototype.save = function(config){

  let form = this;

  form.addEventListener('submit', e=> {

    e.preventDefault();
    let formCreateData = new FormData(form);
    //console.log(formCreateData);

    //passar os dados via ajax
    fetch(form.action, {
      method: form.method,
      body: formCreateData
    })
    .then(response => response.json())
    .then(json => {

      if(json.error){
       if(typeof config.feilure === 'function' ) config.feilure(json.error);
      }else{
        if(typeof config.success === 'function' ) config.success(json);
      }
      //window.location.reload();
      //console.log("JSON: ", json);
    }).catch(err => {

      if(typeof config.feilure === 'function' ) config.feilure(json);

    })

  }); 

}