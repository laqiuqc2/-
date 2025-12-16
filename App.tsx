import React, { useState, useRef, useEffect, useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, Printer, Layout, ZoomIn, ZoomOut, Maximize, Move } from 'lucide-react';
import CertificatePreview from './components/CertificatePreview';
import { CertificateData, TemplateType } from './types';

const App: React.FC = () => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [template, setTemplate] = useState<TemplateType>('classic');
  
  // Canvas State
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 0.8 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const [data, setData] = useState<CertificateData>({
    studentName: '张三',
    startYear: '2025',
    startMonth: '9',
    courseName: '少林长拳基础',
    coachName: '李四',
    issueDate: '2025-12-23'
  });

  // Center and fit canvas on mount
  useEffect(() => {
    handleFitToScreen();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  // --- Zoom & Pan Logic ---

  const handleFitToScreen = useCallback(() => {
    if (previewContainerRef.current) {
      const containerWidth = previewContainerRef.current.clientWidth;
      const containerHeight = previewContainerRef.current.clientHeight;
      const certWidth = 1122;
      const certHeight = 794;
      
      const padding = 40;
      const availableWidth = containerWidth - padding * 2;
      const availableHeight = containerHeight - padding * 2;

      const scaleX = availableWidth / certWidth;
      const scaleY = availableHeight / certHeight;
      const newScale = Math.min(scaleX, scaleY, 1); // Don't scale up past 100% by default if screen is huge

      // Center it
      const newX = (containerWidth - certWidth * newScale) / 2;
      const newY = (containerHeight - certHeight * newScale) / 2;

      setTransform({ x: newX, y: newY, scale: newScale });
    }
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
        // Zoom
        e.preventDefault();
        const zoomSensitivity = 0.001;
        const delta = -e.deltaY * zoomSensitivity;
        const newScale = Math.min(Math.max(0.1, transform.scale + delta), 3);
        
        // Simple zoom to center (can be improved to zoom to mouse cursor, but center is safer for now)
        setTransform(prev => ({ ...prev, scale: newScale }));
    } else {
        // Pan
        // If overflowing, let user scroll naturally? 
        // Or hijack for panning? Let's hijack for consistency if they want "Drag canvas" feel.
        // Actually, let's keep wheel for scrolling if content is larger, 
        // but since we use transform, standard scrollbars won't appear on the container div usually.
        // Let's map wheel to Pan.
        const newX = transform.x - e.deltaX;
        const newY = transform.y - e.deltaY;
        setTransform(prev => ({ ...prev, x: newX, y: newY }));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag if left click
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const newX = e.clientX - dragStart.current.x;
    const newY = e.clientY - dragStart.current.y;
    setTransform(prev => ({ ...prev, x: newX, y: newY }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const adjustZoom = (delta: number) => {
    setTransform(prev => {
        const newScale = Math.min(Math.max(0.1, prev.scale + delta), 3);
        return { ...prev, scale: newScale };
    });
  };

  // --- PDF Generation ---

  const handleDownloadPdf = async () => {
    if (!certificateRef.current) return;
    setIsGeneratingPdf(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2, // Higher scale for better resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${data.studentName}_结业证书.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF', error);
      alert('PDF生成失败，请重试');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 font-sans text-gray-800 flex flex-col">
      {/* Header */}
      <header className="bg-stone-900 text-stone-50 p-4 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="bg-red-700 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl border-2 border-white">武</div>
             <h1 className="text-xl font-bold tracking-wide">武术结业证书生成系统</h1>
          </div>
          <div className="text-sm text-stone-400 hidden sm:block">
             实时预览 · 高清导出
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-[1920px] mx-auto w-full p-4 lg:p-6 flex flex-col lg:flex-row gap-6 h-[calc(100vh-80px)] overflow-hidden">
        
        {/* Left Panel: Controls */}
        <div className="w-full lg:w-[400px] flex-shrink-0 flex flex-col gap-4 overflow-y-auto h-full pb-20 no-scrollbar">
          
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
            <h2 className="text-lg font-bold text-stone-800 mb-4 border-b pb-2 flex items-center gap-2">
              <span className="w-1 h-6 bg-red-700 block rounded-full"></span>
              模版选择
            </h2>
            <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => setTemplate('classic')}
                  className={`p-2 rounded border-2 text-sm font-medium transition-all ${template === 'classic' ? 'border-red-600 bg-red-50 text-red-700' : 'border-stone-200 hover:border-red-200'}`}
                >
                    经典棕黄
                </button>
                <button 
                  onClick={() => setTemplate('traditional')}
                  className={`p-2 rounded border-2 text-sm font-medium transition-all ${template === 'traditional' ? 'border-red-600 bg-red-50 text-red-700' : 'border-stone-200 hover:border-red-200'}`}
                >
                    传统正红
                </button>
                <button 
                  onClick={() => setTemplate('modern')}
                  className={`p-2 rounded border-2 text-sm font-medium transition-all ${template === 'modern' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-stone-200 hover:border-blue-200'}`}
                >
                    现代简约
                </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
            <h2 className="text-lg font-bold text-stone-800 mb-4 border-b pb-2 flex items-center gap-2">
              <span className="w-1 h-6 bg-red-700 block rounded-full"></span>
              基本信息录入
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">学员姓名</label>
                <input
                  type="text"
                  name="studentName"
                  value={data.studentName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                  placeholder="例如：张三"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">入学年份</label>
                  <input
                    type="number"
                    name="startYear"
                    value={data.startYear}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">入学月份</label>
                  <select
                    name="startMonth"
                    value={data.startMonth}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                      <option key={m} value={m}>{m}月</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">修习课程名称</label>
                <input
                  type="text"
                  name="courseName"
                  value={data.courseName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  placeholder="例如：少林长拳"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">教练姓名</label>
                <input
                  type="text"
                  name="coachName"
                  value={data.coachName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">颁发日期</label>
                <input
                  type="date"
                  name="issueDate"
                  value={data.issueDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="w-full py-4 bg-stone-800 hover:bg-stone-900 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1"
          >
            {isGeneratingPdf ? (
              <>
                <Layout className="w-6 h-6 animate-spin" />
                正在生成 PDF...
              </>
            ) : (
              <>
                <Download className="w-6 h-6" />
                下载 PDF 证书
              </>
            )}
          </button>
          
          <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg text-sm border border-yellow-200">
             <p className="font-bold flex items-center gap-2 mb-1">
                <Printer className="w-4 h-4"/> 打印提示
             </p>
             <p>建议使用 A4 纸张横向打印。若背景未能打印，请检查打印机设置中的“打印背景图形”选项。</p>
          </div>
        </div>

        {/* Right Panel: Interactive Preview Area */}
        <div 
            className="flex-grow bg-stone-200 rounded-xl border border-stone-300 relative overflow-hidden flex flex-col"
        >
             {/* Toolbar */}
             <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-white/90 backdrop-blur shadow-md rounded-full px-4 py-2 flex items-center gap-4 border border-stone-200">
                <button onClick={() => adjustZoom(-0.1)} className="p-1 hover:bg-stone-100 rounded text-stone-600" title="Zoom Out">
                    <ZoomOut className="w-5 h-5" />
                </button>
                <span className="text-xs font-mono w-12 text-center text-stone-500">{Math.round(transform.scale * 100)}%</span>
                <button onClick={() => adjustZoom(0.1)} className="p-1 hover:bg-stone-100 rounded text-stone-600" title="Zoom In">
                    <ZoomIn className="w-5 h-5" />
                </button>
                <div className="w-px h-4 bg-stone-300 mx-1"></div>
                <button onClick={handleFitToScreen} className="p-1 hover:bg-stone-100 rounded text-stone-600" title="Fit to Screen">
                    <Maximize className="w-5 h-5" />
                </button>
             </div>

             {/* Canvas Area */}
             <div 
                ref={previewContainerRef}
                className={`flex-grow relative overflow-hidden cursor-grab active:cursor-grabbing ${isDragging ? 'cursor-grabbing' : ''}`}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
             >
                 {/* 
                    We use a container div that moves/scales. 
                    CertificatePreview is fixed size 1122x794 inside.
                 */}
                 <div 
                    style={{
                        transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                        transformOrigin: '0 0',
                        width: '1122px', // Explicit dimensions for the content being transformed
                        height: '794px',
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out' // Smooth zoom, instant drag
                    }}
                    className="absolute top-0 left-0 bg-white shadow-2xl origin-top-left"
                 >
                    <CertificatePreview 
                        ref={certificateRef} 
                        data={data} 
                        template={template}
                        scale={1} // We handle scaling in the parent container now
                    />
                 </div>
             </div>
             
             <div className="absolute bottom-4 right-4 pointer-events-none text-stone-400 text-xs flex items-center gap-1 opacity-60">
                <Move className="w-3 h-3" />
                <span>可拖动 / 滚轮缩放</span>
             </div>
        </div>

      </main>
    </div>
  );
};

export default App;