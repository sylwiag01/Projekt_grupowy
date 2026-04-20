from flask import Flask, render_template

app = Flask(__name__)

# Strona Rodzica (Strona główna)
@app.route('/rodzic')
def rodzic():
    return render_template('rodzic.html')

@app.route('/')
@app.route('/dziecko')
def dziecko():
    return render_template('dziecko.html')

@app.route('/quiz')
def quiz():
    return render_template('quiz.html')

@app.route('/gra')
def gra():
    return render_template('gra.html')

@app.route('/posilek')
def posilek():
    return render_template('posilek.html')

if __name__ == '__main__':
    app.run(debug=True)