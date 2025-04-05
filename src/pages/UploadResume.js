import React, { useState, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


function UploadResume() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobText, setJobText] = useState("");
  const [parsedData, setParsedData] = useState(null);
  const [atsResult, setAtsResult] = useState(null);

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!resumeFile) return;

    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      const res = await axios.post("http://localhost:5000/upload", formData);
      setParsedData(res.data);
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const handleAnalyze = async () => {
    if (!parsedData || !jobText) return;

    try {
      const res = await axios.post("http://localhost:5000/ats-gemini", {
        resumeText: parsedData.text,
        jobText: jobText,
      });
      setAtsResult(res.data);
    } catch (err) {
      console.error("Gemini ATS error:", err);
    }
  };
const atsRef = useRef();
const handleDownloadPDF = async () => {
    const input = atsRef.current;
    if (!input) return;
  
    // Small delay ensures DOM is fully rendered
    setTimeout(async () => {
      try {
        const canvas = await html2canvas(input, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL("image/png");
  
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("ATS_Detailed_Report.pdf");
      } catch (err) {
        console.error("PDF generation error:", err);
      }
    }, 300); // Wait 300ms to let rendering finish
  };
  

  return (
    <div style={{ padding: 20 }}>
      <h2>Resume Analyzer</h2>

      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Resume</button>

      {parsedData && (
        <>
          <h3>Parsed Resume Info</h3>
          <p><strong>Name:</strong> {parsedData.name}</p>
          <p><strong>Email:</strong> {parsedData.email}</p>
          <p><strong>Phone:</strong> {parsedData.phone}</p>
        </>
      )}

      <textarea
        placeholder="Paste Job Description Here"
        rows={10}
        style={{ width: "100%", marginTop: 20 }}
        value={jobText}
        onChange={(e) => setJobText(e.target.value)}
      />

      <button onClick={handleAnalyze} style={{ marginTop: 10 }}>
        Analyze ATS Match
      </button>

      {atsResult && (
  <div style={{ marginTop: 20 }}>
    <h3>ATS Result</h3>
    <button onClick={handleDownloadPDF} style={{ marginTop: 10 }}>
  Download Detailed ATS Report (PDF)
</button>

    <p><strong>Score:</strong> {atsResult.ats_score}</p>
    <p><strong>Matched Keywords:</strong> {atsResult.matched_keywords?.join(", ")}</p>
    <p><strong>Summary:</strong> {atsResult.summary}</p>

    {atsResult.recommendations && atsResult.recommendations.length > 0 && (
      <div style={{ marginTop: 20 }}>
        <h4>Suggestions to Improve:</h4>
        <ul>
          {atsResult.recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
)}
{/* Hidden PDF Report */}
{/* Offscreen Rendered PDF Report */}
{/* Offscreen Rendered PDF Report */}
<div
  style={{
    position: "fixed",
    top: "-10000px",
    left: "-10000px",
    width: "800px",
  }}
>
<div
  id="pdf-report"
  ref={atsRef}
  style={{
    padding: 20,
    fontSize: 12,
    backgroundColor: "white",
    width: "595px", // A4 width in pixels
    color: "#000",
    fontFamily: "Arial",
  }}
>
  <h1 style={{ textAlign: "center" }}>📋 ATS Resume Analysis Report</h1>
  <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>

  <h2>👤 Resume Overview</h2>
  <p><strong>Name:</strong> {parsedData?.name}</p>
  <p><strong>Email:</strong> {parsedData?.email}</p>
  <p><strong>Phone:</strong> {parsedData?.phone}</p>

  <h2>📄 Resume Text Snippet</h2>
  <p>{parsedData?.text?.slice(0, 600)}...</p>

  <h2>📝 Job Description Provided</h2>
  <p>{jobText?.slice(0, 1000)}...</p>

  <h2>📊 ATS Match Score</h2>
  <p><strong>Score:</strong> {atsResult?.ats_score} / 100</p>
  <p>
    <strong>Analysis:</strong>{" "}
    {atsResult?.ats_score > 80
      ? "Your resume is highly aligned with the job description. Great job!"
      : atsResult?.ats_score > 50
      ? "Moderate alignment. Improvements recommended."
      : "Low alignment. Major changes needed."}
  </p>

  <h2>✅ Matched Keywords</h2>
  <ul>
    {atsResult?.matched_keywords?.map((kw, idx) => (
      <li key={idx}>{kw}</li>
    ))}
  </ul>

  <h2>❌ Missing Keywords (Important but not found)</h2>
  <ul>
    {atsResult?.missing_keywords?.length > 0 ? (
      atsResult?.missing_keywords.map((kw, idx) => <li key={idx}>{kw}</li>)
    ) : (
      <li>None</li>
    )}
  </ul>

  <h2>🧠 AI Summary of Resume vs JD</h2>
  <p>{atsResult?.summary}</p>

  <h2>🔍 Detailed Recommendations</h2>
  <ul>
    {atsResult?.recommendations?.length > 0 ? (
      atsResult.recommendations.map((rec, idx) => <li key={idx}>{rec}</li>)
    ) : (
      <li>No specific suggestions provided.</li>
    )}
  </ul>

  <hr />
  <p style={{ textAlign: "center", fontSize: 10 }}>
    Powered by Gemini AI | ATS Optimized Resume Insights
  </p>
</div>

</div>

    </div>
  );
}

export default UploadResume;