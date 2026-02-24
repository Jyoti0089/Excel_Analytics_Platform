import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Alert from '../UI/Alert';
import { 
  CloudArrowUpIcon, 
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const Upload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors.some(e => e.code === 'file-invalid-type')) {
        setError('Please upload a valid Excel file (.xlsx or .xls)');
      } else if (rejection.errors.some(e => e.code === 'file-too-large')) {
        setError('File size must be less than 10MB');
      } else {
        setError('Invalid file. Please try again.');
      }
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    setError('');
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem("token");

const response = await axios.post(
  "https://excel-analytics-platform-vj3o.onrender.com/api/upload",
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  }
);

      const { upload } = response.data;
      setUploadedFile(upload);
      setPreview(upload.data);
      toast.success('File uploaded successfully!');
    } catch (error) {
      const message = error.response?.data?.message || 'Upload failed. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const proceedToAnalyze = () => {
    if (uploadedFile) {
      navigate(`/analyze/${uploadedFile.id}`);
    }
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setPreview(null);
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Upload Excel File</h1>
          <p className="mt-2 text-gray-600">
            Upload your Excel file to start creating interactive charts and analyses
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert 
            type="error" 
            message={error} 
            className="mb-6"
            closable
            onClose={() => setError('')}
          />
        )}
        
        {/* Upload Area */}
        {!uploadedFile && (
          <Card className="mb-6">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
                isDragActive && !isDragReject
                  ? 'border-indigo-400 bg-indigo-50'
                  : isDragReject
                  ? 'border-red-400 bg-red-50'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              
              <div className="flex flex-col items-center">
                <CloudArrowUpIcon className={`h-16 w-16 mb-4 ${
                  isDragActive && !isDragReject ? 'text-indigo-500' : 
                  isDragReject ? 'text-red-500' : 'text-gray-400'
                }`} />
                
                {uploading ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="text-lg text-gray-600">Uploading and processing...</p>
                    <p className="text-sm text-gray-500">Please wait while we parse your Excel file</p>
                  </div>
                ) : isDragReject ? (
                  <div>
                    <p className="text-lg text-red-600 mb-2">Invalid file type</p>
                    <p className="text-sm text-gray-500">Please upload .xlsx or .xls files only</p>
                  </div>
                ) : isDragActive ? (
                  <div>
                    <p className="text-lg text-indigo-600 mb-2">Drop the Excel file here</p>
                    <p className="text-sm text-gray-500">Release to upload your file</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg text-gray-600 mb-2">
                      Drag and drop your Excel file here, or click to select
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Supports .xlsx and .xls files (Max: 10MB)
                    </p>
                    <Button variant="primary">Choose File</Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Upload Success */}
        {uploadedFile && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-full p-2 mr-4">
                  <CheckCircleIcon className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-green-900">
                    Upload Successful!
                  </h3>
                  <div className="mt-1">
                    <p className="text-sm text-green-700">
                      <strong>{uploadedFile.fileName}</strong>
                    </p>
                    <p className="text-sm text-green-600">
                      {uploadedFile.rowCount.toLocaleString()} rows • {uploadedFile.headers.length} columns
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button onClick={resetUpload} variant="outline" size="sm">
                  Upload Another
                </Button>
                <Button onClick={proceedToAnalyze} variant="primary" className="flex items-center">
                  Analyze Data
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Data Preview */}
        {preview && preview.length > 0 && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Data Preview</h3>
              <span className="text-sm text-gray-500">
                Showing first 10 rows of {uploadedFile?.rowCount.toLocaleString()} total
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {uploadedFile.headers.map((header, index) => (
                      <th
                        key={`${header}-${index}`}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <div className="flex items-center">
                          <span className="truncate" title={header}>{header}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {preview.slice(0, 10).map((row, index) => (
                    <tr 
                      key={index} 
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100 transition-colors duration-150'}
                    >
                      {uploadedFile.headers.map((header, headerIndex) => (
                        <td 
                          key={`${header}-${headerIndex}`} 
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                        >
                          <div className="max-w-xs truncate" title={row[header] || ''}>
                            {row[header] || <span className="text-gray-400">—</span>}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Upload;