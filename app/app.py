#./app/app.py
#from flask_restful import Resource, Api, reqparse
from bson.json_util import dumps
from pymongo import MongoClient
from flask import Flask, Response, render_template
from flask import request, jsonify
from bson import ObjectId


app = Flask(__name__)


if __name__ == '__main__':
    app.run(debug=True)

# Conectar al servicio (docker) "mongo" en su puerto estandar
client = MongoClient("mongo", 27017)

# Base de datos
db = client.cockteles

@app.route('/')
def index():
    # Encontramos los documentos de la coleccion "recipes"
    recetas = db.recipes.find() # devuelve un cursor(*), no una lista ni un iterador

    lista_recetas = []
    for  receta in recetas:
        app.logger.debug(receta)  # salida consola
        lista_recetas.append(receta)

    response = {
        'len': len(lista_recetas),
        'data': lista_recetas
    }

    # Convertimos los resultados a formato JSON
    resJson = dumps(response)
    return render_template('index.html')

@app.route('/todas_las_recetas')
def mongo():
    # Encontramos los documentos de la coleccion "recipes"
    recetas = db.recipes.find() # devuelve un cursor(*), no una lista ni un iterador

    lista_recetas = []
    for  receta in recetas:
        app.logger.debug(receta)  # salida consola
        lista_recetas.append(receta)

    response = {
        'len': len(lista_recetas),
        'data': lista_recetas
    }

    # Convertimos los resultados a formato JSON
    resJson = dumps(response)

    # Devolver en JSON al cliente cambiando la cabecera http para especificar que es un json
    return Response(resJson, mimetype='application/json')


@app.route('/recetas_de/<de>')
def mongo2(de):
    cad=str(de)
    recetas = db.recipes.find( { "name": cad } ) # devuelve un cursor(*), no una lista ni un iterador
    lista_recetas = []
    for  receta in recetas:
        app.logger.debug(receta)  # salida consola  cuba_libre
        lista_recetas.append(receta)

    response = {
        'len': len(lista_recetas),
        'data': lista_recetas
    }

    # Convertimos los resultados a formato JSON
    resJson = dumps(response)

    # Devolver en JSON al cliente cambiando la cabecera http para especificar que es un json
    return Response(resJson, mimetype='application/json')

@app.route('/recetas_con/<con>')
def mongo3(con):
    cad=str(con)
    recetas = db.recipes.find( { "ingredients":{"$elemMatch":{ "name": cad} } } ) # devuelve un cursor(*), no una lista ni un iterador
    lista_recetas = []
    for  receta in recetas:
        app.logger.debug(receta)  # salida consola
        lista_recetas.append(receta)

    response = {
        'len': len(lista_recetas),
        'data': lista_recetas
    }

    # Convertimos los resultados a formato JSON
    resJson = dumps(response)

    # Devolver en JSON al cliente cambiando la cabecera http para especificar que es un json
    return Response(resJson, mimetype='application/json')

@app.route('/recetas_compuestas_de/<size>/<ing>')
def mongo4(size,ing):
    cad1=int(size)
    cad2=str(ing)
    recetas = db.recipes.find( { cad2 : { "$size": cad1 } } ) # devuelve un cursor(*), no una lista ni un iterador
    lista_recetas = []
    for  receta in recetas:
        app.logger.debug(receta)  # salida consola
        lista_recetas.append(receta)

    response = {
        'len': len(lista_recetas),
        'data': lista_recetas
    }

    # Convertimos los resultados a formato JSON
    resJson = dumps(response)

    # Devolver en JSON al cliente cambiando la cabecera http para especificar que es un json
    return Response(resJson, mimetype='application/json')



@app.route('/api/recipes', methods=['GET', 'POST'])
def api_1():
    if request.method == 'GET':
        param = request.args.get('con')
        if ( param ):
            cad=str(param)
            recetas = db.recipes.find( { "ingredients":{"$elemMatch":{ "name": cad} } } ) # devuelve un cursor(*), no una lista ni un iterador
            lista_recetas = []
            for  receta in recetas:
                app.logger.debug(receta)  # salida consola
                lista_recetas.append(receta)

            response = {
                'len': len(lista_recetas),
                'data': lista_recetas
            }

            # Convertimos los resultados a formato JSON
            resJson = dumps(response)

            # Devolver en JSON al cliente cambiando la cabecera http para especificar que es un json
            return Response(resJson, mimetype='application/json')
        else:
            lista = []
            buscados = db.recipes.find().sort('name')
            for recipe in buscados:
                recipe['_id'] = str(recipe['_id']) # casting a string (es un ObjectId)
                lista.append(recipe)
            return jsonify(lista)

    if request.method == 'POST':
        content = request.json
        db.recipes.insert_one(content)
        return dumps(content)


#para devolver una, modificar o borrar
@app.route('/api/recipes/<id>', methods=['GET', 'PUT', 'DELETE'])
def api_2(id):
    if request.method == 'GET':
        buscado = db.recipes.find_one({'_id':ObjectId(id)})
        if buscado:
           buscado['_id'] = str(buscado['_id']) # casting a string (es un ObjectId)
           return jsonify(buscado)
        else:
            return jsonify({'error':'Not found'}), 404

    if request.method == 'DELETE':
        buscado = db.recipes.find_one_and_delete({'_id':ObjectId(id)})
        if buscado:
            db.recipe.find_one_and_delete(buscado)
            buscado['_id'] = str(buscado['_id'])
            return jsonify(buscado)
        else:
            return jsonify({'error':'Not found'}), 404

    if request.method == 'PUT':
        buscado = db.recipes.find_one({'_id':ObjectId(id)})
        if buscado:
           content = { "$set": request.json }
           db.recipes.update_one(buscado,content)
           buscado['_id'] = str(buscado['_id']) # casting a string (es un ObjectId)
           return jsonify(buscado)
        else:
            return jsonify({'error':'Not found'}), 404






