const form = document.getElementById('hanoiForm');
const moveList = document.getElementById('moveList');
const moveCountDisplay = document.getElementById('moveCount');
let towers = { A: [], B: [], C: [] };

// Handle form submission
form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const numDisks = document.getElementById('num_disks').value;

    // Fetch moves from the Flask backend
    const response = await fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ num_disks: parseInt(numDisks) })
    });

    const data = await response.json();
    renderMoves(data.moves);
    createDisks(numDisks);  // Create disks visually after form submission
    moveCountDisplay.innerText = data.moves.length;

    // Automatically start the animation
    animateHanoi(data.moves);
});

// Render moves in the list
function renderMoves(moves) {
    moveList.innerHTML = '';
    moves.forEach((move, index) => {
        const li = document.createElement('li');
        li.innerText = move;
        moveList.appendChild(li);
    });
}

// Create the disks and place them on Tower A
function createDisks(numDisks) {
    // Clear existing disks and towers
    towers = { A: [], B: [], C: [] };
    document.querySelectorAll('.disk').forEach(disk => disk.remove());

    const towerA = document.getElementById('towerA');
    for (let i = numDisks; i > 0; i--) {
        const disk = document.createElement('div');
        disk.classList.add('disk');
        disk.style.width = `${20 + i * 20}px`;
        disk.style.bottom = `${(numDisks - i) * 22}px`;
        disk.dataset.size = i.toString();  // Store the size as a string
        towers.A.push(disk);
        towerA.appendChild(disk);
    }

    console.log("Initial Tower State:", towers);  // Debugging - check initial state of towers
}

// Automatically start the animation once the moves are fetched
async function animateHanoi(moves) {
  for (let move of moves) {
      console.log(`Processing move: ${move}`);
      const moveParts = move.split(' ');  // Split the move string
      const diskSize = moveParts[2];  // Get disk size (e.g., '1')
      const fromTower = moveParts[4];  // Get source tower (e.g., 'A')
      const toTower = moveParts[6];  // Get destination tower (e.g., 'C')

      console.log(`Parsed Move - disk: ${diskSize}, from: ${fromTower}, to: ${toTower}`);

      // Additional validation to ensure fromTower and toTower are valid keys
      if (!towers[fromTower]) {
          console.error(`Invalid tower: ${fromTower}`);
          return;
      }
      if (!towers[toTower]) {
          console.error(`Invalid tower: ${toTower}`);
          return;
      }

      await moveDisk(diskSize, fromTower, toTower);  // Animate disk movement
  }
}


// Function to move the disk
function moveDisk(diskSize, fromTower, toTower) {
    return new Promise(resolve => {
        // Ensure correct towers are referenced (A, B, C)
        console.log("Before Move Towers:", towers);  // Debugging
        const disk = towers[fromTower].find(d => d.dataset.size === diskSize);

        if (disk) {
            towers[fromTower] = towers[fromTower].filter(d => d !== disk);  // Remove from source tower
            towers[toTower].push(disk);  // Add to target tower

            const targetTower = document.getElementById(`tower${toTower}`);
            const newPosition = towers[toTower].length - 1;  // Calculate new position in the tower

            disk.style.bottom = `${newPosition * 22}px`;  // Adjust visual position

            setTimeout(() => {
                targetTower.appendChild(disk);  // Move the disk to the new tower
                console.log("After Move Towers:", towers);  // Debugging
                resolve();
            }, 500);  // Delay for animation
        } else {
            console.error(`Disk not found in tower ${fromTower} with size ${diskSize}`);
            resolve();
        }
    });
}
