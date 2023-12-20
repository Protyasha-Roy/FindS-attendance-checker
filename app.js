const entryBtn = document.getElementById('entryBtn');
const checkBtn = document.getElementById('checkBtn');
const addAttendanceBtn = document.getElementById('addAttendanceBtn');
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

});


addAttendanceBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    const userId = localStorage.getItem('userId');
    const searchRollInput = document.getElementById('searchRoll').value.trim();
    const searchRolls = searchRollInput.split(',').map(roll => roll.trim());

    if (searchRollInput === '') {
        document.getElementById('checkMessage').innerText = 'Please fill the textarea before checking.';
        return;
    }

    try {
        // Post attendance record to the server
        const addAttendanceResponse = await fetch('https://finds-server.onrender.com/addAttendance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                rolls: searchRolls,
            }),
        });

        if (!addAttendanceResponse.ok) {
            throw new Error('Failed to add attendance');
        }

        const data = await addAttendanceResponse.json();

        document.getElementById('checkMessage').innerText = data.message;
        searchRollField.value = '';


    } catch (error) {
        console.error('Error adding attendance:', error);
        document.getElementById('checkMessage').innerText = 'Failed to add attendance';
    }
});
