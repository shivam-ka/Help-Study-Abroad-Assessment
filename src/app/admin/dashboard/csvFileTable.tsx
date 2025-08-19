import React from 'react';
import Papa from 'papaparse';
import { Course, University } from '@/lib/types';

type FileType = 'university' | 'course';

interface CsvFileTableProps {
  file: File;
  fileType: FileType;
}

export default function CsvFileTable({ file, fileType }: CsvFileTableProps) {
  const [data, setData] = React.useState<University[] | Course[]>([]);
  const [headers, setHeaders] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLoading(true);
    setError(null);
    setData([]);
    setHeaders([]);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError(`Error parsing CSV: ${results.errors[0].message}`);
          setLoading(false);
          return;
        }

        if (!results.meta.fields || results.data.length === 0) {
          setError('CSV file is empty or invalid');
          setLoading(false);
          return;
        }

        // Validate data structure based on fileType
        try {
          if (fileType === 'university') {
            const universities = results.data as University[];
            setData(universities);
          } else {
            const courses = results.data as Course[];
            setData(courses);
          }
          setHeaders(results.meta.fields || []);
        } catch (e) {
          setError(`Data format doesn't match expected ${fileType} structure`);
          console.error(e);
        } finally {
          setLoading(false);
        }
      },
      error: (error) => {
        setError(error.message);
        setLoading(false);
      }
    });
  }, [file, fileType]);

  // Add debug logging to see what's happening
  React.useEffect(() => {
    console.log('Loading state:', loading);
    console.log('Error state:', error);
    console.log('Data length:', data.length);
    console.log('Headers length:', headers.length);
  }, [loading, error, data, headers]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-4">Processing CSV file...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
        <p className="font-semibold">Error:</p>
        <p>{error}</p>
        <p className="mt-2 text-sm">Please check your CSV format and try again.</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
        <p>No data found in the CSV file</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg">
      <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
        <p className="text-green-700 font-semibold">
          Successfully loaded {data.length} {fileType === 'university' ? 'universities' : 'courses'}
        </p>
      </div>
      
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            {headers.map((header, index) => (
              <th key={index} scope="col" className="px-6 py-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="bg-white border-b hover:bg-gray-50">
              {headers.map((header, colIndex) => (
                <td key={colIndex} className="px-6 py-4 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                  {renderCellValue(row[header as keyof typeof row])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Helper function to properly render array values and other special cases
function renderCellValue(value: any): string {
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}