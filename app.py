from flask import Flask, render_template

app = Flask(__name__)

# Strona Rodzica (Strona główna)
@app.route('/rodzic')
def rodzic():
    return render_template('rodzic.html')

# Strona Dziecka
@app.route('/')
def dziecko():
    return render_template('dziecko.html')

if __name__ == '__main__':
    app.run(debug=True)