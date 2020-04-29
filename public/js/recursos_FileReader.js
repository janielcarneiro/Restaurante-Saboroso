class RecursosFileReader{

    constructor(inputE1, imgE1){

        this.inputE1 = inputE1;
        this.imgE1 = imgE1;

        this.initInputEvent();

    }

    initInputEvent(){

        //console.log( document.querySelector(this.inputE1))
        document.querySelector(this.inputE1).addEventListener('change', e => {
            //console.log(e.target.files[0]);
            //ler o meu arquivor recebido
            this.reader(e.target.files[0]).then(result => {

                document.querySelector(this.imgE1).src = result;

            }).catch(err => {

                console.error("ERROR: ", err);

            });

        });

    }

    reader(file){

        return new Promise((resolve, reject)=> {

            //para ler os arquivos
            let reader = new FileReader();


            reader.onload = function(){

                resolve(reader.result);
                console.log(reader);

            };

            reader.onerror = function(){

                reject("Não foi possivel ler a imagem");

            };

            reader.readAsDataURL(file);
                    
        });

    }

}