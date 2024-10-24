from flask import Flask, jsonify, request, render_template

app = Flask(__name__)


def hanoi(n, source, target, spare, source_name, target_name, spare_name, moves):
    if n > 0:
        hanoi(n - 1, source, spare, target, source_name, spare_name, target_name, moves)
        disk = source[-1]
        move = f"Move disk {disk} from {source_name} to {target_name}"
        moves.append(move)
        target.append(source.pop())
        hanoi(n - 1, spare, target, source, spare_name, target_name, source_name, moves)

@app.route('/', methods=['POST'])
def solve_hanoi():
    data = request.get_json()
    num_disks = data['num_disks']

    A = list(range(num_disks, 0, -1))
    B = []
    C = []
    moves = []

    hanoi(num_disks, A, C, B, 'A', 'C', 'B', moves)

    # Return moves as JSON for the front-end to process
    return jsonify({"moves": moves})

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
