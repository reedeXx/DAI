const bSwitch = document.querySelector('#switch');
const searchInput = document.querySelector("[data-search]");

bSwitch.addEventListener('click', () => {
    document.body.classList.toggle('dark');

    if(document.body.classList.contains('dark')){
        localStorage.setItem('dark-mode', 'true');
    } else {
        localStorage.setItem('dark-mode', 'false');
    }
});

//Modo actual.
if(localStorage.getItem('dark-mode') === 'true'){
    document.body.classList.add('dark');
    
} else {
    document.body.classList.remove('dark');
    
}

let recetas = []              // declaraciones   
let html_str  = ''              // de variables
let i         = 0               //

searchInput.addEventListener("input", e => {
    let j         = 0   
    const value = e.target.value.toLowerCase()
    console.log(value)
    
    recetas.forEach(receta => {
      j++
      const isVisible = receta.name.toLowerCase().includes(value) 
      if ( !isVisible ){
        document.getElementsByClassName(`fila-${j}`)[0].style.visibility='hidden';
      }

   
    })
    
})



// fetch devuelve una promise
fetch('/api/recipes')           // GET por defecto,
.then(res => res.json())        // respuesta en json, otra promise
.then(filas => {                // arrow function
   
    filas.forEach(fila => {     // bucle ES6, arrow function
        i++
        recetas.push(fila)      // se guardan para después sacar cada una             
        // ES6 templates
         
        html_str += `<tr class="fila-${i}">
                       <td>${i}</td>
                       <td>
                       <button onclick="detalle('${i}')" type="button" class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#staticBackdrop-${i}">
                          ${fila.name}
                       </button>

                </td>
                <td>
                <button onclick="obtener_receta('${i}')" type="button" class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#staticEdit">Edit</button>
                <button onclick="modalborrar('${i}')" type="button" class="btn btn-sm btn-warning" data-bs-toggle="modal" data-bs-target="#staticDelete">Delete</button>
                </td>
                </tr>
                `
                         // ES6 templates
        
    });

    document.getElementById('tbody').innerHTML=html_str  // se pone el html en su sitio
})

function detalle(i) {  // saca un modal con la información de cada coctel
  // saca un modal con receta[i] div class=modal-dialog>
    let str=``

    str += `<div class="detalle">
                        <div>
                            <div>
                                <div>
                                    <h1>${recetas.at(i-1).name}</h1>
                                </div>
                                <div>
                                    <h2> Ingredientes: </h2>`

    str += `<ul>`                                 
    recetas.at(i-1).ingredients.forEach( fila =>  { 
        str += `<ul> ${fila.name} </ul>`
    } );
    str += `</ul>`  

    str += `<h2> Instrucciones: </h2>`
    str += `<ul>`    
    instrucciones = recetas.at(i-1).instructions.toString()
    aux = instrucciones.split(",")
    aux.forEach( i => str += `<ul>${i}</ul>` )
    str += `</ul>`       
    str += `</div>
                                </div>
                        </div>
                    </div>`
                                    
        
    alertifyobj = alertify.confirm(recetas.at(i-1).name).setContent(str)
 


}



function modaleditar(i){

// onclick="editar('${i}')" type="button" name='borrar' value="true" class="btn btn-primary" 

    html_str += `<div class="modal fade" id="staticEdit-${i}" tabindex="-1" aria-labelledby="staticEdit-${i}" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticEdit-${i-1}">Esta seguro que quiere borrar</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        
                        <div class="modal-body">
                                                                   
                            <label>Nombre:</label>
                            <input type="text" name="name" >
                            <label>Garnish:</label>
                            <input type="text" name="garnish">                                
                            <input type=submit onclick="editar('${i}')" '>

                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>                                                                                                   
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Enviar</button>
                        </div>
                        
                    </div>
                </div>`
     
        
    document.getElementById('tbody').innerHTML=html_str       
  
}

function obtener_receta(i){

    document.getElementById("idreceta").setAttribute( "value", i )
    let newrcp = document.getElementById("idreceta").value
    //console.log(newrcp)

}

function obtener_receta_borrar(i){

    document.getElementById("idrecetaborrar").setAttribute( "value", i )
    let newrcp = document.getElementById("idrecetaborrar").value
    //console.log(newrcp)

}

function editar(){
        //document.getElementById("garnish").value
        let newname = document.getElementById("idname").value
        console.log(newname)
        let newgarnish =document.getElementById("idgarnish").value
        console.log(newgarnish)
        const resultIng = document.getElementById('Ingtextarea').value.split('\n');
        //console.log(resultIng.at(0))

        const resultIns = document.getElementById('Instextarea').value;
        console.log(resultIns)

        const ingredientes = []

        for (var i = 0; i < resultIng.length  ; i++) {
            let nombre = resultIng.at(i)
            ingredientes.push( {
                name: nombre,
                quantity: {
                    quantity : "1 1/2",
                    unit: "oz"
                }
            })
        }

        let receta = {

            name : newname,
            garnish : newgarnish,
            ingredients : ingredientes,
            instructions : resultIns

        }

        console.log(receta)


        fetch('api/recipes/' + recetas.at(document.getElementById("idreceta").value-1)._id, {
        method: 'PUT',
        headers: {
         'Content-Type': 'application/json'
        },
        body: JSON.stringify(receta)
        })
        .then(res => {
        return res.json()
        })
        .then(window.location.reload())
        .then(data => console.log(data))
    
}

function crear(){
        //document.getElementById("garnish").value
        let newname = document.getElementById("idcrearname").value
        console.log(newname)
        let newgarnish =document.getElementById("idcreargarnish").value
        console.log(newgarnish)
        const resultIng = document.getElementById('Ingcreartextarea').value.split('\n');
        //console.log(resultIng.at(0))

        const resultIns = document.getElementById('Inscreartextarea').value;
        const ingredientes = []

        for (var i = 0; i < resultIng.length  ; i++) {
            let nombre = resultIng.at(i)
            ingredientes.push( {
                name: nombre,
                quantity: {
                    quantity : "1 1/2",
                    unit: "oz"
                }
            })
        }

        let receta = {

            name : newname,
            garnish : newgarnish,
            ingredients : ingredientes,
            instructions : resultIns

        }

        console.log(receta)


        fetch('api/recipes', {
        method: 'POST',
        headers: {
         'Content-Type': 'application/json'
        },
        body: JSON.stringify(receta)
        })
        .then(res => {
        return res.json()
        })
        .then(window.location.reload())
        .then(data => console.log(data))
    
}

function borrar(){


    return fetch('api/recipes/'+ recetas.at(document.getElementById("idrecetaborrar").value-1)._id,  { 
        method: 'DELETE'
    })
    .then(window.location.reload()) // or res.json()
    .then(res => console.log(res))
    

}

function modalborrar(i){ 
/*
    html_str += `<div class="modal fade" id="staticDelete-${i}" tabindex="-1" aria-labelledby="staticDelete-${i}" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticDelete-${i-1}">Esta seguro que quiere borrar</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                           ¿ Procede a usted al borrado de la receta ${recetas.at(i-1).name}?
                        </div>
                        <div class="modal-footer">
                            <button type="button" value="false" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>                                                                                                   
                            <button onclick="borrar('${i}')" type="button" name='borrar' value="true" class="btn btn-primary"> Save changes</button>                                        
                             
                        </div>
                    </div>
                </div>`
    document.getElementById('tbody').innerHTML=html_str
    
*/     
alertifyobj2 = alertify.confirm( '¿ Desea borrar la receta?', function(){ borrar(i); alertify.success('Ok')
 }
        , function(){ alertify.error('Cancel')});

alertifyobj2.setContent('<h1>¿ Desea borrar la receta ?</h1>')

}



function borrar(i){

    return fetch('api/recipes/' + recetas.at(i-1)._id,  { 
        method: 'DELETE'
    })
    .then(window.location.reload()) // or res.json()
    .then(res => console.log(res))
    
}
