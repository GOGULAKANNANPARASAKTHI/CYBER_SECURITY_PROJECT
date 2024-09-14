document.addEventListener('DOMContentLoaded', () => {
    const resultsContainer = document.getElementById('results');
    const codeBlock = document.getElementById('codeBlock');
    const analysisResults = localStorage.getItem('analysisResults') ? JSON.parse(localStorage.getItem('analysisResults')) : [];
    const fileContent = localStorage.getItem('fileContent');

    const downloadCSVButton = document.getElementById('downloadCSV');
    const downloadPDFButton = document.getElementById('downloadPDF');

    downloadCSVButton.addEventListener('click', downloadCSV);
    downloadPDFButton.addEventListener('click', downloadPDF);

    function downloadCSV() {
        const csvContent = generateCSV(analysisResults);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'analysis_results.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
    
  
    function generateCSV(results) {
        const headers = [
            'Title', 'Severity', 'Line', 'Line Content', 'Description', 'Impact', 
            'Category', 'Tags', 'CWE', 'Reference Link', 'Positive Examples', 
            'Negative Examples', 'Fix Steps', 'Fix Examples', 'Rationale'
        ];
        let csvContent = headers.join(',') + '\n';

        results.forEach(result => {
            const positiveExamples = result.examples.positive.map(ex => `${ex.code}: ${ex.description}`).join('; ');
            const negativeExamples = result.examples.negative.map(ex => `${ex.code}: ${ex.description}`).join('; ');
            const fixExamples = result.fix.examples.map(ex => `${ex.code}: ${ex.description}`).join('; ');

            const row = [
                `"${result.title}"`,
                result.severity,
                result.line,
                `"${result.lineContent}"`,
                `"${result.description}"`,
                `"${result.impact}"`,
                result.category,
                `"${result.tags.join(', ')}"`,
                result.cwe,
                result.reference_link,
                `"${positiveExamples}"`,
                `"${negativeExamples}"`,
                `"${result.fix.steps.join('; ')}"`,
                `"${fixExamples}"`,
                `"${result.rationale}"`
            ];
            csvContent += row.join(',') + '\n';
        });

        return csvContent;
    }

    function downloadPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let yOffset = 10;
    
        doc.setFontSize(16);
        doc.text('Analysis Results', 10, yOffset);
        yOffset += 15;
    
        analysisResults.forEach((result, index) => {
            if (yOffset > 280) {
                doc.addPage();
                yOffset = 10;
            }
    
            doc.setFontSize(12);
            doc.text(`${index + 1}. ${result.title}`, 10, yOffset);
            yOffset += 10;
    
            doc.setFontSize(10);
            yOffset = addTextToPDF(doc, `Severity: ${result.severity}`, 15, yOffset);
            yOffset = addTextToPDF(doc, `Line: ${result.line}`, 15, yOffset);
            yOffset = addTextToPDF(doc, `Line Content: ${result.lineContent}`, 15, yOffset);
            yOffset = addTextToPDF(doc, `Description: ${result.description}`, 15, yOffset);
            yOffset = addTextToPDF(doc, `Impact: ${result.impact}`, 15, yOffset);
            yOffset = addTextToPDF(doc, `Category: ${result.category}`, 15, yOffset);
            yOffset = addTextToPDF(doc, `Tags: ${result.tags.join(', ')}`, 15, yOffset);
            yOffset = addTextToPDF(doc, `CWE: ${result.cwe}`, 15, yOffset);
            yOffset = addTextToPDF(doc, `Reference Link: ${result.reference_link}`, 15, yOffset);
    
            yOffset = addTextToPDF(doc, 'Positive Examples:', 15, yOffset);
            result.examples.positive.forEach(ex => {
                yOffset = addTextToPDF(doc, `  Code: ${ex.code}`, 20, yOffset);
                yOffset = addTextToPDF(doc, `  Description: ${ex.description}`, 20, yOffset);
            });
    
            yOffset = addTextToPDF(doc, 'Negative Examples:', 15, yOffset);
            result.examples.negative.forEach(ex => {
                yOffset = addTextToPDF(doc, `  Code: ${ex.code}`, 20, yOffset);
                yOffset = addTextToPDF(doc, `  Description: ${ex.description}`, 20, yOffset);
            });
    
            yOffset = addTextToPDF(doc, 'Fix Steps:', 15, yOffset);
            result.fix.steps.forEach(step => {
                yOffset = addTextToPDF(doc, `  - ${step}`, 20, yOffset);
            });
    
            yOffset = addTextToPDF(doc, 'Fix Examples:', 15, yOffset);
            result.fix.examples.forEach(ex => {
                yOffset = addTextToPDF(doc, `  Code: ${ex.code}`, 20, yOffset);
                yOffset = addTextToPDF(doc, `  Description: ${ex.description}`, 20, yOffset);
            });
    
            yOffset = addTextToPDF(doc, `Rationale: ${result.rationale}`, 15, yOffset);
    
            yOffset += 10;
        });
    
        doc.save('analysis_results.pdf');
    }
    
    function addTextToPDF(doc, text, x, y) {
        const textLines = doc.splitTextToSize(text, 180);
        doc.text(textLines, x, y);
        return y + (textLines.length * 5);
    }


    if (fileContent) {
        let highlightedContent = fileContent.split('\n').map((line, index) => {
            const result = analysisResults.find(res => res.line === index + 1);
            return result ? `<span class="highlight">${line}</span>` : line;
            if (result) {
                return `<span class="highlight" style="background-color: red;">${line}</span>`; // Highlight vulnerability line with red color
            } else {    
                return line;
            }
        }).join('\n');
        codeBlock.innerHTML = highlightedContent;

          // Store positive examples in localStorage
    const positiveExamples = analysisResults.reduce((acc, result) => {
        return acc.concat(result.examples.positive.map(example => ({
            code: example.code,
            description: example.description
        })));
    }, []);

    localStorage.setItem('positiveExamples', JSON.stringify(positiveExamples));

        // Send uploaded code and analysis results to chatbot
        const chatInput = document.querySelector('.typing-input');
        const positiveExamplesText = positiveExamples.map(example => `Code: ${example.code}\nDescription: ${example.description}`).join('\n');
        chatInput.value = `Uploaded Code: ${fileContent}\nPositive Examples:\n${positiveExamplesText}\nThe above file contains vulnerabilities and based on the positive examples, rectify all the vulnerabilities present in the code and give the corrected code only and don't give unnecessary text.`;
        document.querySelector('#send-message-button').click();
    }

    document.getElementById('toggleResults').addEventListener('click', () => {
        const analysisResultsHtml = resultsContainer.innerHTML;
        const newPage = window.open("", "Analysis Results", "width=800,height=600");
        newPage.document.write(`
            <html>
                <head>
                    <title>Analysis Results</title>
                    <style>
/* General styles */
body {
    font-family: 'Roboto', Arial, sans-serif;
    background-color: #f0f2f5;
    color: #333;
    margin: 0;
    padding: 20px;
    line-height: 1.6;
}

.container {
    max-width: 900px;
    margin: 0 auto;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    padding: 20px;
}

h2, h3 {
    color: #222;
    margin-bottom: 15px;
}

h2 {
    font-size: 28px;
    font-weight: 700;
}

h3 {
    font-size: 20px;
    font-weight: 600;
}

/* Header Styles */
.result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #eee;
    padding-bottom: 15px;
    margin-bottom: 25px;
}

.severity-badge {
    padding: 8px 14px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    color: #fff;
    text-transform: uppercase;
}

/* Severity Colors */
.severity-badge.low {
    background-color: #28a745;
}

.severity-badge.medium {
    background-color: #ff9800;
}

.severity-badge.high {
    background-color: #dc3545;
}

/* Content Styles */
.result-content .section {
    margin-bottom: 35px;
}

.detail-item {
    margin-bottom: 12px;
    font-size: 16px;
    color: #555;
}

.detail-item strong {
    display: inline-block;
    width: 140px;
    color: #333;
}

.detail-item span, 
.detail-item code,
.detail-item p {
    color: #666;
}

.vulnerability-line-content, 
.positive-example-code, 
code {
    background-color: #f7f7f7;
    padding: 10px;
    border-radius: 5px;
    font-family: 'Courier New', Courier, monospace;
    display: block;
    margin-top: 8px;
    overflow-x: auto;
}

ul {
    padding-left: 20px;
    margin-top: 10px;
    color: #666;
}

ul li {
    margin-bottom: 8px;
}

/* Links */
a {
    color: #007bff;
    text-decoration: none;
    transition: color 0.2s;
}

a:hover {
    color: #0056b3;
    text-decoration: underline;
}

/* Responsiveness */
@media (max-width: 768px) {
    .result-header {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .result-header h2 {
        margin-bottom: 10px;
    }

    .detail-item strong {
        width: 100%;
        margin-bottom: 4px;
    }
}


                 </style>
                </head>
                <body>
                    <h1>Analysis Results</h1>
                    <div>${analysisResultsHtml}</div>
                </body>
            </html>
        `);
    });

    if (analysisResults && analysisResults.length > 0) {
        analysisResults.forEach(result => {
            const resultElement = document.createElement('div');
            resultElement.className = 'analysis-item';

            // Positive examples
            const positiveExamples = result.examples.positive.map(example => `
                <li>
                    <strong>Code:</strong> <code>${example.code}</code><br>
                    <strong>Description:</strong> ${example.description}
                </li>`).join('');

            // Negative examples
            const negativeExamples = result.examples.negative.map(example => `
                <li>
                    <strong>Code:</strong> <code>${example.code}</code><br>
                    <strong>Description:</strong> ${example.description}
                </li>`).join('');

            // Fix steps
            const fixSteps = result.fix.steps.map(step => `
                <li>${step}</li>`).join('');

            // Fix examples
            const fixExamples = result.fix.examples.map(example => `
                <li>
                    <strong>Code:</strong> <code>${example.code}</code><br>
                    <strong>Description:</strong> ${example.description}
                </li>`).join('');

             resultElement.innerHTML = `
                <div class="analysis-result container">
    <div class="result-header">
        <h2>${result.title}</h2>
        <div class="severity-badge ${result.severity.toLowerCase()}">${result.severity}</div>
    </div>
    <div class="result-content">
        <div class="section">
            <h3>Vulnerability Details</h3>
            <div class="detail-item">
                <strong>Line:</strong>
                <span class="vulnera">${result.line}</span>
            </div>
            <div class="detail-item">
            <strong>Line Content:</strong>
            <pre><code class="vulnerability-line-content">${result.lineContent}</code></pre>
           </div>
            <div class="detail-item">
                <strong>Description:</strong>
                <p>${result.description}</p>
            </div>
        </div>
        <div class="section">
            <h3>Analysis</h3>
            <div class="detail-item">
                <strong>Impact:</strong>
                <span>${result.impact}</span>
            </div>
            <div class="detail-item">
                <strong>Category:</strong>
                <span>${result.category}</span>
            </div>
            <div class="detail-item">
                <strong>Tags:</strong>
                <span>${result.tags.join(', ')}</span>
            </div>
        </div>
        <div class="section">
            <h3>References</h3>
            <div class="detail-item">
                <strong>CWE:</strong>
                <span>${result.cwe}</span>
            </div>
            <div class="detail-item">
                <strong>Reference link:</strong>
                <a href="${result.reference_link}" target="_blank">${result.reference_link || 'N/A'}</a>
            </div>
        </div>
        <div class="section">
            <h3>Examples</h3>
            <div class="detail-item">
                <strong>Positive:</strong>
                <code class="positive-example-code">${positiveExamples}</code>
            </div>
            <div class="detail-item">
                <strong>Negative:</strong>
                <code>${negativeExamples}</code>
            </div>
        </div>
        <div class="section">
            <h3>Fix</h3>
            <div class="detail-item">
                <strong>Steps:</strong>
                <ul>${fixSteps}</ul>
            </div>
            <div class="detail-item">
                <strong>Examples:</strong>
                <code>${fixExamples}</code>
            </div>
        </div>
        <div class="section">
            <h3>Rationale</h3>
            <p>${result.rationale}</p>
        </div>
    </div>
</div>
                `;

            resultsContainer.appendChild(resultElement);
        });
    } else {
        resultsContainer.innerHTML = '<p>No vulnerabilities found.</p>';
    }


    
});