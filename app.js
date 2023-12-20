// let savedStudents = JSON.parse(localStorage.getItem('students')) || [];


// document.getElementById('entryBtn').addEventListener('click', (event) => {
//     event.preventDefault();
//     const studentName = document.getElementById('studentName').value.trim();
//     const studentRoll = document.getElementById('studentRoll').value.trim();


//     if (studentName === '' || studentRoll === '') {
//         document.getElementById('entryMessage').innerText = 'Please fill both fields before submitting.';
//         return;
//     }

//     const existingStudent = savedStudents.find(student => student.roll === studentRoll);

//     if (existingStudent) {
//         document.getElementById('entryMessage').innerText = 'A student with this roll already exists.';
//         return;
//     }

//     const newStudent = { name: studentName, roll: studentRoll };

//     savedStudents.push(newStudent);

    
//     localStorage.setItem('students', JSON.stringify(savedStudents));

    
//     document.getElementById('entryMessage').innerText = 'New entry submitted: ' + studentName + ' (Roll: ' + studentRoll + ')';
   
//     document.getElementById('studentName').value = '';
//     document.getElementById('studentRoll').value = '';
// });

// document.getElementById('checkBtn').addEventListener('click', () => {
//     const searchRollInput = document.getElementById('searchRoll').value.trim();
//     const searchRolls = searchRollInput.split(',').map(roll => roll.trim());

//     if (searchRollInput === '') {
//         document.getElementById('checkMessage').innerText = 'Please fill the textarea before checking.';
//         return;
//     }

//     const mismatchedRolls = searchRolls.filter(searchRoll => {
//         return !savedStudents.some(student => student.roll == searchRoll);
//     });

//     if (mismatchedRolls.length > 0) {
//         document.getElementById('checkMessage').innerText = 'Mismatched Rolls: ' + mismatchedRolls.join(', ');
//     } else {
//         document.getElementById('checkMessage').innerText = 'All Rolls Matched!';
//     }

//     document.getElementById('searchRoll').value = '';
// });
const entryBtn = document.getElementById('entryBtn');
const checkBtn = document.getElementById('checkBtn');
const searchRollField = document.getElementById('searchRoll');
const entryMessage = document.getElementById('entryMessage');
const checkMessage = document.getElementById('checkMessage');

const userId = localStorage.getItem('userId');

entryBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    const studentName = document.getElementById('studentName').value.trim();
    const studentRoll = document.getElementById('studentRoll').value.trim();

    if (studentName === '' || studentRoll === '') {
        entryMessage.innerText = 'Please fill both fields before submitting.';
        return;
    }

    try {
        const response = await fetch(`https://finds-server.onrender.com/add-student`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: studentName, roll: studentRoll, userId: userId }),
        });

        const data = await response.json();
        entryMessage.innerText = data.message;
    } catch (error) {
        console.error('Error adding new student:', error);
        entryMessage.innerText = 'Error adding new student.';
    }

    document.getElementById('studentName').value = '';
    document.getElementById('studentRoll').value = '';
});

checkBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    const searchRollInput = searchRollField.value.trim();

    if (searchRollInput === '') {
        checkMessage.innerText = 'Please fill the textarea before checking.';
        return;
    }

    try {
        const response = await fetch('https://finds-server.onrender.com/check-rolls', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rolls: searchRollInput.split(',').map(roll => roll.trim()), userId }),
        });

        const data = await response.json();

        if (data.mismatchedRolls.length > 0) {
            checkMessage.innerText = 'Mismatched Rolls: ' + data.mismatchedRolls.join(', ');
        } else {
            checkMessage.innerText = 'All Rolls Matched!';
        }
    } catch (error) {
        console.error('Error checking rolls:', error);
        checkMessage.innerText = 'Error checking rolls.';
    }

    searchRollField.value = '';
});
