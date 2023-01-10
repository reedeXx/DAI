from flask import Flask
from fibonacci import *
from balanceo import *
from flask import render_template

app = Flask(__name__)
urls = []

@app.route('/')
def hello_world():
  return 'Hello, World!'

@app.route('/fibonacci/<int:n>')
def fibonacci(n):
  return str(fib(n))

@app.route('/balanceo/<string:cad>')
def balanceo(cad):
  if balan(cad):
    print("La cadena es correcta.")
  else:
    print("La cadena es incorrecta.")    

@app.route('/image')
def image():
  return render_template('base.html')

@app.errorhandler(404)
def page_not_found(error):
  return render_template('404 error not found'), 404