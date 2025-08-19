'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, Building2, CheckCircle, Download, X } from 'lucide-react';
import CsvFileTable from './csvFileTable';

function UploadCard({ 
  title, 
  description, 
  onUpload, 
  onDownloadTemplate,
  onClear,
  hasFile
}: { 
  title: string, 
  description: string, 
  onUpload: (file: File) => void, 
  onDownloadTemplate?: () => void,
  onClear?: () => void,
  hasFile?: boolean
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setSelectedFile(file);
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please select a .csv file.',
        });
        setSelectedFile(null);
        event.target.value = '';
      }
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      setIsUploading(true);
      // Simulate upload process
      setTimeout(() => {
        onUpload(selectedFile);
        setIsUploading(false);
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.getElementById(`file-upload-${title}`) as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }, 500);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    const fileInput = document.getElementById(`file-upload-${title}`) as HTMLInputElement;
    if (fileInput) fileInput.value = '';
    if (onClear) onClear();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 font-headline text-2xl">
              {title === 'Universities' ? <Building2 className="text-accent" /> : <FileText className="text-accent" />}
              {title} Data
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex gap-2">
            {onDownloadTemplate && (
              <Button variant="outline" size="sm" onClick={onDownloadTemplate}>
                <Download className="mr-2 h-4 w-4" />
                Template
              </Button>
            )}
            {hasFile && (
              <Button variant="outline" size="sm" onClick={handleClear}>
                <X className="mr-2 h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          id={`file-upload-${title}`}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          disabled={isUploading || hasFile}
          className="file:text-primary file:font-semibold"
        />
        {selectedFile && <p className="text-sm text-muted-foreground">Selected file: {selectedFile.name}</p>}
        <Button 
          onClick={handleUpload} 
          disabled={!selectedFile || isUploading || hasFile} 
          className="w-full"
        >
          {isUploading ? (
            'Uploading...'
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" /> Upload CSV
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const { toast } = useToast();

  const [universityFile, setUniversityFile] = useState<File | null>(null);
  const [courseFile, setCourseFile] = useState<File | null>(null);

  const handleUniversityUpload = (file: File) => {
    setUniversityFile(file);
    toast({
      title: 'University CSV uploaded',
      description: 'The university data has been successfully loaded.',
    });
  };

  const handleCourseUpload = (file: File) => {
    setCourseFile(file);
    toast({
      title: 'Course CSV uploaded',
      description: 'The course data has been successfully loaded.',
    });
  };

  const clearUniversityFile = () => {
    setUniversityFile(null);
  };

  const clearCourseFile = () => {
    setCourseFile(null);
  };

  const handleUniversityTemplateDownload = () => {
    // ... (keep your existing template download code)
  };

  const handleCourseTemplateDownload = () => {
    // ... (keep your existing template download code)
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="font-headline text-4xl font-bold mb-2 text-primary">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-8">Manage university and course data from here.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <UploadCard
          title="Universities"
          description="Upload a CSV file with university information."
          onUpload={handleUniversityUpload}
          onDownloadTemplate={handleUniversityTemplateDownload}
          onClear={clearUniversityFile}
          hasFile={!!universityFile}
        />
        <UploadCard
          title="Courses"
          description="Upload a CSV file with course information."
          onUpload={handleCourseUpload}
          onDownloadTemplate={handleCourseTemplateDownload}
          onClear={clearCourseFile}
          hasFile={!!courseFile}
        />
      </div>

      <div className="space-y-8">
        {universityFile && (
          <div className="space-y-2">
            <h2 className="font-headline text-2xl font-semibold flex items-center gap-2">
              <Building2 className="text-accent" />
              University Data
            </h2>
            <CsvFileTable file={universityFile} fileType="university" />
          </div>
        )}

        {courseFile && (
          <div className="space-y-2">
            <h2 className="font-headline text-2xl font-semibold flex items-center gap-2">
              <FileText className="text-accent" />
              Course Data
            </h2>
            <CsvFileTable file={courseFile} fileType="course" />
          </div>
        )}
      </div>
    </div>
  );
}