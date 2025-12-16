import React, { forwardRef } from 'react';
import { CertificateData, TemplateType } from '../types';

interface CertificatePreviewProps {
  data: CertificateData;
  template: TemplateType;
  scale?: number;
}

// A4 Landscape dimensions in pixels (at ~96 DPI, A4 is approx 1123x794)
const BASE_WIDTH = 1122;
const BASE_HEIGHT = 794;

const CertificatePreview = forwardRef<HTMLDivElement, CertificatePreviewProps>(({ data, template, scale = 1 }, ref) => {
  const { studentName, startYear, startMonth, courseName, coachName, issueDate, customBgImage } = data;

  // Format date
  const dateObj = new Date(issueDate);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();

  // Helper to render custom background
  const CustomBackground = () => (
    customBgImage ? (
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src={customBgImage} 
          alt="Custom Background" 
          className="w-full h-full object-cover"
        />
        {/* Optional overlay to ensure text readability if needed, currently disabled to show full image */}
        {/* <div className="absolute inset-0 bg-white/30"></div> */}
      </div>
    ) : null
  );

  // Render content based on template
  const renderContent = () => {
    switch (template) {
      case 'modern':
        return (
          <div className={`relative w-full h-full text-slate-900 font-serif-sc flex flex-col px-16 pt-16 pb-24 overflow-hidden ${!customBgImage ? 'bg-white' : ''}`}>
             <CustomBackground />
             
             {/* Modern Background Accents - only show if no custom bg */}
             {!customBgImage && (
               <>
                 <div className="absolute top-0 left-0 w-32 h-32 bg-blue-900 clip-path-polygon"></div>
                 <div className="absolute bottom-0 right-0 w-64 h-8 bg-blue-900/10"></div>
                 <div className="absolute bottom-8 right-0 w-48 h-8 bg-blue-900/20"></div>
               </>
             )}
             
             {/* Border */}
             <div className="absolute inset-8 border-2 border-slate-200 z-10 pointer-events-none"></div>
             <div className="absolute inset-10 border border-slate-100 z-10 pointer-events-none"></div>

             <div className="relative z-20 flex flex-col h-full">
                <div className="flex justify-between items-start mb-16">
                   <div>
                      <h1 className="text-5xl font-bold text-blue-900 tracking-widest mb-2">结业证书</h1>
                      <p className="text-slate-500 uppercase tracking-[0.3em] text-sm">Certificate of Completion</p>
                   </div>
                   <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                      武
                   </div>
                </div>

                <div className="flex-grow text-2xl leading-relaxed text-slate-700 space-y-6">
                   <div className="flex items-baseline gap-4">
                      <span className="text-4xl font-bold text-slate-900 border-b-2 border-blue-900 pb-1 px-4">{studentName}</span>
                      <span>同学：</span>
                   </div>
                   <p className="text-justify indent-8">
                      自 <span className="font-bold text-slate-900">{startYear}</span> 年 <span className="font-bold text-slate-900">{startMonth}</span> 月起，
                      修习“<span className="font-bold text-blue-900">{courseName}</span>”课程。
                      历时一学期，勤学苦练，成绩合格，准予结业。
                   </p>
                </div>

                <div className="mt-12 flex justify-end gap-16 items-end">
                   <div className="text-center">
                      <div className="text-sm text-slate-400 mb-4">主教练签名</div>
                      <div className="font-cursive text-3xl border-b border-slate-300 pb-2 min-w-[120px]">{coachName}</div>
                   </div>
                   <div className="text-right">
                      <div className="text-xl font-bold text-slate-900">{year} / {month} / {day}</div>
                      <div className="text-sm text-slate-400 mt-1">颁发日期</div>
                   </div>
                </div>
             </div>
          </div>
        );

      case 'traditional':
        return (
          <div className={`relative w-full h-full text-[#4a0e0e] font-serif-sc flex flex-col p-12 overflow-hidden ${!customBgImage ? 'bg-[#fdfbf7]' : ''}`}>
            <CustomBackground />

            {/* Traditional Pattern BG - only show if no custom bg */}
            {!customBgImage && (
               <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#8b0000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            )}
            
            {/* Traditional Borders */}
            <div className="absolute inset-4 border-4 border-[#8b0000] z-10 pointer-events-none"></div>
            <div className="absolute inset-6 border border-[#8b0000] z-10 pointer-events-none"></div>
            
            {/* Corner Ornaments */}
            <div className="z-10 pointer-events-none">
                <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-[#8b0000]"></div>
                <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-[#8b0000]"></div>
                <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-[#8b0000]"></div>
                <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-[#8b0000]"></div>
            </div>

            <div className="relative z-20 h-full flex flex-col items-center justify-between pt-12 pb-20">
               <div className="text-center space-y-4">
                  <div className="text-[#8b0000] text-lg tracking-[0.5em] font-bold">中华武术传承</div>
                  <h1 className="text-[56px] font-black text-[#8b0000] tracking-[1em] ml-8">结业证书</h1>
               </div>

               <div className="w-full px-16 space-y-6 text-[24px] leading-loose">
                  <div className="flex flex-col gap-2">
                     <div className="flex items-end">
                        <span className="text-[32px] font-bold border-b-2 border-[#8b0000] px-6 text-center min-w-[120px]">{studentName}</span>
                        <span className="ml-4">学员：</span>
                     </div>
                  </div>
                  <p className="indent-[2em] text-justify">
                     于 <span className="font-bold">{startYear}</span> 年 <span className="font-bold">{startMonth}</span> 月至 <span className="font-bold">{issueDate.split('-')[1]}</span> 月，
                     在本馆修习 <span className="font-bold text-[#8b0000] text-[28px] mx-1">“{courseName}”</span>。
                     期间尊师重道，刻苦磨练，技艺精进，通过考核，特发此证。
                  </p>
               </div>

               <div className="w-full flex justify-between items-end px-20 mt-8">
                   <div className="flex flex-col items-center">
                       <span className="text-lg text-[#8b0000]/80 mb-2">批准单位</span>
                       <div className="w-32 h-32 border-4 border-[#8b0000]/20 rounded-full flex items-center justify-center">
                           <span className="text-4xl text-[#8b0000]/20 font-bold">武</span>
                       </div>
                   </div>
                   <div className="flex flex-col gap-4 text-right">
                       <div className="text-2xl">
                           教 练：<span className="font-bold font-cursive text-3xl ml-2">{coachName}</span>
                       </div>
                       <div className="text-xl tracking-widest">
                           {year} 年 {month} 月 {day} 日
                       </div>
                   </div>
               </div>
            </div>
          </div>
        );

      case 'classic':
      default:
        return (
          <div className={`relative w-full h-full text-gray-900 font-serif-sc flex flex-col justify-between overflow-hidden ${!customBgImage ? 'bg-[#FFFAF0]' : ''}`}>
            <CustomBackground />

            {/* Watermark - only show if no custom bg or keep transparently? keeping it as it adds character */}
            {!customBgImage && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.03]">
                   <span className="text-[500px] font-black tracking-widest text-red-900">武</span>
                </div>
            )}

            {/* Borders */}
            <div className="absolute inset-4 border-[12px] border-[#8B4513] z-10 pointer-events-none"></div>
            <div className="absolute inset-6 border-[2px] border-[#DAA520] z-10 pointer-events-none"></div>

            {/* Content */}
            <div className="relative z-20 px-24 pt-20 pb-28 h-full flex flex-col">
                <div className="flex justify-center mb-10">
                    <h1 className="text-[64px] font-black tracking-[1.5rem] text-[#8B4513] border-b-4 border-double border-[#8B4513] pb-4">
                        结业证书
                    </h1>
                </div>

                <div className="flex-grow text-[26px] leading-[2.5] text-gray-800 space-y-4">
                    {/* Fixed alignment here using items-baseline */}
                    <div className="flex items-baseline">
                        <span className="font-bold border-b-2 border-gray-400 px-4 min-w-[150px] text-center text-[32px] mx-1 text-[#8B4513]">
                            {studentName}
                        </span>
                        <span className="text-[26px]">同学：</span>
                    </div>

                    <p className="indent-[2em] text-justify">
                        心慕武道，恪守武德，自 <span className="font-bold">{startYear}</span> 年 <span className="font-bold">{startMonth}</span> 月进入武术课程学习。
                        系统修习“<span className="font-bold underline decoration-dotted decoration-gray-400 underline-offset-8 px-2">{courseName}</span>”课程，历时一学期期满。
                        期间勤学苦练，精进不懈，已掌握本阶段之要旨，功架端正，理法渐明，品行端正，尊师重道。
                    </p>
                    
                    <p className="indent-[2em]">
                        经综合考核，成绩合格，准予结业。
                    </p>
                    <p className="indent-[2em]">
                        特颁此证，以资证明。
                    </p>
                </div>

                <div className="flex flex-col items-end text-[24px] space-y-4 pr-12">
                    <div className="flex items-center">
                        <span>教练：</span>
                        <span className="font-bold font-cursive min-w-[150px] text-center border-b border-gray-800 pb-1">
                            {coachName}
                        </span>
                    </div>
                    <div className="text-right tracking-widest">
                        <span>{year}</span>年<span>{month}</span>月<span>{day}</span>日
                    </div>
                </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div 
      className="inline-block shadow-2xl bg-white origin-top-left select-none"
      style={{
        transform: `scale(${scale})`,
        width: `${BASE_WIDTH}px`,
        height: `${BASE_HEIGHT}px`
      }}
    >
      <div 
        ref={ref}
        style={{ width: '100%', height: '100%' }}
      >
        {renderContent()}
      </div>
    </div>
  );
});

CertificatePreview.displayName = 'CertificatePreview';

export default CertificatePreview;