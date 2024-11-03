const students = [
    { name: "Bhargava", subjects: ["Math", "Science", "English", "History"], grades: [95, 98, 90, 92], attendance: 98, extracurricular: ["Science Club", "Music"] },
    { name: "Abdul", subjects: ["Math", "Science", "English", "History"], grades: [90, 88, 92, 85], attendance: 95, extracurricular: ["Debate", "Chess"] },
    { name: "Manish", subjects: ["Math", "Science", "English", "History"], grades: [78, 80, 75, 82], attendance: 88, extracurricular: ["Football"] },
    { name: "Aadya", subjects: ["Math", "Science", "English", "History"], grades: [85, 82, 88, 90], attendance: 92, extracurricular: ["Art Club"] },
    { name: "Ashrith", subjects: ["Math", "Science", "English", "History"], grades: [70, 72, 68, 75], attendance: 85, extracurricular: ["Drama Club"] },
    { name: "Revanth", subjects: ["Math", "Science", "English", "History"], grades: [55, 60, 58, 62], attendance: 80, extracurricular: ["Basketball"] },
    { name: "Anjali", subjects: ["Math", "Science", "English", "History"], grades: [50, 55, 65, 58], attendance: 75, extracurricular: ["Chess"] },
    { name: "Sujitha", subjects: ["Math", "Science", "English", "History"], grades: [60, 62, 64, 59], attendance: 70, extracurricular: ["Drama Club"] },
    { name: "Teja", subjects: ["Math", "Science", "English", "History"], grades: [85, 90, 80, 88], attendance: 95, extracurricular: ["Robotics Club"] },
    { name: "Nikitha", subjects: ["Math", "Science", "English", "History"], grades: [92, 94, 91, 89], attendance: 97, extracurricular: ["Photography Club"] } 
];

const calculateAverage = (numbers) => numbers.reduce((a, b) => a + b, 0) / numbers.length;

function sortStudentsByAverageGrade() {
    return students.sort((a, b) => {
        const averageA = calculateAverage(a.grades);
        const averageB = calculateAverage(b.grades);
        return averageB - averageA;
    });
}

function InsertStudentTable() {
    const sortedStudents = sortStudentsByAverageGrade();
    const tableBody = document.getElementById('student-data');
    tableBody.innerHTML = '';
    sortedStudents.forEach(student => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = student.name;
        row.insertCell(1).textContent = student.subjects.join(", ");
        row.insertCell(2).textContent = Math.round(calculateAverage(student.grades));
        row.insertCell(3).textContent = student.attendance + "%";
        row.insertCell(4).textContent = student.extracurricular.join(", ");
    });
}

function updateOverview() {
    document.getElementById('total-students').textContent = students.length;
    const classAverage = Math.round(calculateAverage(students.map(s => calculateAverage(s.grades))));
    document.getElementById('class-average').textContent = classAverage + "%";
    const subjectAverages = students[0].subjects.map((subject, index) => ({
        subject,
        average: calculateAverage(students.map(s => s.grades[index]))
    }));
    const topSubject = subjectAverages.reduce((a, b) => a.average > b.average ? a : b);
    document.getElementById('top-subject').textContent = topSubject.subject;
}

function createCharts() {
    createScoreComparisonChart();
    createSubjectPassChart();
    createPassFailChart();
    createExtracurricularChart();
}

function createScoreComparisonChart() {
    const ctx = document.getElementById('scoreComparisonChart').getContext('2d');
    const subjects = students[0].subjects;
    const topperScores = subjects.map((_, index) => Math.max(...students.map(s => s.grades[index])));
    const classAverages = subjects.map((_, index) => Math.round(calculateAverage(students.map(s => s.grades[index]))));
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: subjects,
            datasets: [{
                label: 'Topper Score',
                data: topperScores,
                backgroundColor: 'rgba(75, 192, 192, 0.6)'
            }, {
                label: 'Class Average',
                data: classAverages,
                backgroundColor: 'rgba(255, 99, 132, 0.6)'
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createSubjectPassChart() {
    const ctx = document.getElementById('subjectPassChart').getContext('2d');
    const subjects = students[0].subjects;
    const passCounts = subjects.map((_, index) => students.filter(s => s.grades[index] >= 80).length);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: subjects,
            datasets: [{
                label: 'Pass Count',
                data: passCounts,
                backgroundColor: 'rgba(75, 192, 192, 0.6)'
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createPassFailChart() {
    const ctx = document.getElementById('passFailChart').getContext('2d');
    const passCount = students.filter(s => calculateAverage(s.grades) >= 60).length;
    const failCount = students.length - passCount;
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Pass', 'Fail'],
            datasets: [{
                data: [passCount, failCount],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)']
            }]
        }
    });
}

function createExtracurricularChart() {
    const ctx = document.getElementById('extracurricularChart').getContext('2d');
    const extracurricularCounts = {};
    students.forEach(s => s.extracurricular.forEach(activity => {
        if (!extracurricularCounts[activity]) {
            extracurricularCounts[activity] = 0;
        }
        extracurricularCounts[activity]++;
    }));
    const labels = Object.keys(extracurricularCounts);
    const data = Object.values(extracurricularCounts);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Extracurricular Activities',
                data,
                backgroundColor: 'rgba(75, 192, 192, 0.6)'
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

InsertStudentTable();
updateOverview();
createCharts();

function PerformanceDropDown() {
    const select = document.getElementById('student-select');
    students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.name;
        option.textContent = student.name;
        select.appendChild(option);
    });
}

function predictPerformance() {
    const studentName = document.getElementById('student-select').value;
    const student = students.find(s => s.name === studentName);
    const averageGrade = Math.round(calculateAverage(student.grades));
    let prediction = '';

    if (averageGrade < 60) {
        prediction = "Should concentrate more. Extra support and focused study sessions recommended.";
    } else if (averageGrade >= 60 && averageGrade < 70) {
        prediction = "Showing improvement. Continue to work on weak areas and maintain consistent study habits.";
    } else if (averageGrade >= 70 && averageGrade < 80) {
        prediction = "Good progress. Focus on advanced concepts and aim for excellence in favorite subjects.";
    } else if (averageGrade >= 80 && averageGrade < 90) {
        prediction = "Very good performance. Consider taking on additional academic challenges or leadership roles.";
    } else {
        prediction = "Excellent performance! Encourage participation in academic competitions and mentoring peers.";
    }

    const resultDiv = document.getElementById('prediction-result');
    resultDiv.innerHTML = `
        <h3>${student.name}'s Performance Prediction</h3>
        <p>Current Average Grade: ${averageGrade}%</p>
        <p>Prediction : ${prediction}</p>
    `;
}

function FeedbackStudentDropDown(){
    const select = document.getElementById('feedback-student-select');
    select.innerHTML = '';
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a student';
    select.appendChild(defaultOption);
    students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.name;
        option.textContent = student.name;
        select.appendChild(option);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    PerformanceDropDown();
    FeedbackStudentDropDown();
});

document.querySelector('.give-pop').addEventListener('click', function() {
    alert('Feedback submitted');
    
    const clearFields = document.querySelectorAll('.clearinfo');
    clearFields.forEach(function(field) {
        field.value = '';
    });
});