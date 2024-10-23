from flask import Flask, jsonify

app = Flask(__name__)

def hanoi(n, source, target, spare):
    global count
    if n > 0:
        hanoi(n - 1, source, spare, target)
        target.append(source.pop())
        count += 1
        hanoi(n - 1, spare, target, source)

@app.route('/solve/<int:num_disks>', methods=['GET'])
def solve_hanoi(num_disks):
    global count
    count = 0
    A = list(range(num_disks, 0, -1))
    B = []
    C = []

    hanoi(num_disks, A, C, B)

    return jsonify({"number_of_moves": count})

if __name__ == '__main__':
    app.run(debug=True)
