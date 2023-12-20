let savedStudents = JSON.parse(localStorage.getItem('students')) || [];


document.getElementById('entryBtn').addEventListener('click', (event) => {
    event.preventDefault();
    const studentName = document.getElementById('studentName').value.trim();
    const studentRoll = document.getElementById('studentRoll').value.trim();


    if (studentName === '' || studentRoll === '') {
        document.getElementById('entryMessage').innerText = 'Please fill both fields before submitting.';
        return;
    }

    const existingStudent = savedStudents.find(student => student.roll === studentRoll);

    if (existingStudent) {
        document.getElementById('entryMessage').innerText = 'A student with this roll already exists.';
        return;
    }

    const newStudent = { name: studentName, roll: studentRoll };

    savedStudents.push(newStudent);

    
    localStorage.setItem('students', JSON.stringify(savedStudents));

    
    document.getElementById('entryMessage').innerText = 'New entry submitted: ' + studentName + ' (Roll: ' + studentRoll + ')';
   
    document.getElementById('studentName').value = '';
    document.getElementById('studentRoll').value = '';
});

document.getElementById('checkBtn').addEventListener('click', () => {
    const searchRollInput = document.getElementById('searchRoll').value.trim();
    const searchRolls = searchRollInput.split(',').map(roll => roll.trim());

    if (searchRollInput === '') {
        document.getElementById('checkMessage').innerText = 'Please fill the textarea before checking.';
        return;
    }

    const mismatchedRolls = searchRolls.filter(searchRoll => {
        return !savedStudents.some(student => student.roll == searchRoll);
    });

    if (mismatchedRolls.length > 0) {
        document.getElementById('checkMessage').innerText = 'Mismatched Rolls: ' + mismatchedRolls.join(', ');
    } else {
        document.getElementById('checkMessage').innerText = 'All Rolls Matched!';
    }

    document.getElementById('searchRoll').value = '';
});
