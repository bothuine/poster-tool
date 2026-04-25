'use client';

import React, { useEffect, useRef, useState } from "react";
import { Download, ImagePlus, Plus, Trash2, Palette, MapPin, Facebook, Phone, ZoomIn, ZoomOut, Move, RotateCcw } from "lucide-react";

type SetList = React.Dispatch<React.SetStateAction<string[]>>;
type BgBottomShape = "flat" | "slant-up" | "slant-down" | "curved" | "wave" | "zigzag" | "ellipse" | "star" | "arch";

const POSTER_W = 1024;
// BẢN FIX: Kéo dài chiều cao tổng thể Poster để tạo độ thoáng (Từ 1536 lên 1640)
const POSTER_H = 1640; 

const L = {
  bg: "#fcf9f2",
  imageX: 55,
  imageY: 40,  // Căn nhẹ ảnh xuống
  imageW: 914,
  imageH: 540, 
  imageR: 42,
  cardX: 55,
  cardY: 610,  // Đẩy thẻ nội dung xuống để lộ phần xéo nền nhiều hơn
  cardW: 914,
  cardH: 900,  // Kéo dài thẻ nội dung thêm 80px, siêu rộng rãi
  cardR: 44,
};

export default function PosterEditorTool() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [imgTransform, setImgTransform] = useState({ x: 0, y: 0, scale: 1 });

  const [price, setPrice] = useState("2199k");
  const [packageTitle, setPackageTitle] = useState("SON NEWBORN");
  const [studioName, setStudioName] = useState("");

  const [serviceItems, setServiceItems] = useState([
    "Chụp ngay tại nhà",
    "2 Bối cảnh",
    "Hỗ trợ toàn bộ trang phục và concept",
  ]);

  const [productItems, setProductItems] = useState([
    "11 Ảnh chỉnh sửa hoàn thiện",
    "10 Ảnh in lụa size 13x18",
    "1 Ảnh ép gỗ khung size 40x60",
    "Trả toàn bộ file ảnh gốc Fullsize",
  ]);

  const [address, setAddress] = useState("43 Quang Trung, Eakar (Đường 720)");
  const [facebook, setFacebook] = useState("Son Studio Baby & Family");
  const [phone, setPhone] = useState("0909 200 998");

  const [themeColor, setThemeColor] = useState("#628b55");
  const [textColor, setTextColor] = useState("#628b55");
  const [borderColor, setBorderColor] = useState("#628b55");
  const [cardColor, setCardColor] = useState("#fcf9f2");
  const [imageBorderColor, setImageBorderColor] = useState("#ffffff");

  // Thiết lập mặc định giống hệt mẫu (Xéo xuống, cao 620, nghiêng 150)
  const [bgBottomShape, setBgBottomShape] = useState<BgBottomShape>("slant-down");
  const [shapeHeight, setShapeHeight] = useState(620); 
  const [shapeIntensity, setShapeIntensity] = useState(150);

  const measureRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(1);

  useEffect(() => {
    const resizePreview = () => {
      if (!measureRef.current) return;
      const availableWidth = measureRef.current.clientWidth;
      setPreviewScale(Math.min(1, availableWidth / POSTER_W));
    };
    
    resizePreview();
    window.addEventListener("resize", resizePreview);
    document.fonts.ready.then(resizePreview); 
    return () => window.removeEventListener("resize", resizePreview);
  }, []);

  const data: PosterData = {
    photo, imgTransform, price, packageTitle, studioName,
    serviceItems, productItems, address, facebook, phone,
    themeColor, borderColor, textColor, cardColor, imageBorderColor,
    bgBottomShape, shapeHeight, shapeIntensity
  };

  const downloadPNG = async () => {
    await document.fonts.ready;
    const canvas = document.createElement("canvas");
    canvas.width = POSTER_W * 2; canvas.height = POSTER_H * 2;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(2, 2);
    await drawPosterCanvas(ctx, data);
    const link = document.createElement("a");
    link.download = `poster-sonstudio-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
      setImgTransform({ x: 0, y: 0, scale: 1 }); 
    }
  }

  return (
    <main className="min-h-screen bg-zinc-100 p-2 md:p-6 lg:p-8 font-quicksand overflow-x-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Quicksand:wght@500;600;700;800;900&family=Fredoka:wght@600;700&display=swap');
        .font-cursive { font-family: 'Dancing Script', cursive; }
        .font-quicksand { font-family: 'Quicksand', sans-serif; }
        .font-cute { font-family: 'Fredoka', sans-serif; }
      `}} />

      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[430px_1fr]">
        <section className="rounded-2xl bg-white p-4 shadow-sm md:p-5 h-fit space-y-5">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Poster Pro Editor</h1>
            <p className="text-sm text-zinc-500">Bố cục mở rộng, tương tác mượt mà.</p>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-zinc-200 p-4 bg-zinc-50/50">
              <h3 className="mb-4 flex items-center gap-2 font-bold text-zinc-700">
                <Palette className="h-5 w-5" /> Tuỳ chỉnh nền phía trên
              </h3>
              <div className="space-y-4">
                <select
                  value={bgBottomShape}
                  onChange={(e) => setBgBottomShape(e.target.value as BgBottomShape)}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none font-medium text-zinc-700 focus:ring-2 focus:ring-zinc-400"
                >
                  <option value="slant-down">Cắt xéo xuống (Chuẩn mẫu)</option>
                  <option value="slant-up">Cắt xéo lên</option>
                  <option value="curved">Đường cong Bezier</option>
                  <option value="arch">Vòm cung</option>
                  <option value="wave">Đường sóng (Wave)</option>
                  <option value="ellipse">Vòng Elip</option>
                  <option value="zigzag">Răng cưa (Zigzag)</option>
                  <option value="star">Tia nhọn (Star)</option>
                  <option value="flat">Cắt ngang (Phẳng)</option>
                </select>
                
                <Range label="Chiều cao nền" value={shapeHeight} min={300} max={1000} step={10} onChange={setShapeHeight} />
                {bgBottomShape !== 'flat' && (
                  <Range label="Độ sâu uốn/cắt" value={shapeIntensity} min={0} max={300} step={5} onChange={setShapeIntensity} />
                )}
              </div>
            </div>

            <label className="block">
              <div className="mt-2 flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 p-5 hover:bg-zinc-50 transition">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                <div className="text-center text-sm font-semibold text-zinc-500">
                  <ImagePlus className="mx-auto mb-2 h-7 w-7" />
                  Bấm để tải ảnh lên
                </div>
              </div>
            </label>

            <div className="grid grid-cols-2 gap-x-3 gap-y-4 rounded-xl border border-zinc-200 p-4 bg-zinc-50/50">
              <div className="col-span-2 text-sm font-bold text-zinc-700 mb-1">MÀU SẮC CHỦ ĐẠO</div>
              <ColorInput label="Màu tổng thể" value={themeColor} onChange={setThemeColor} />
              <ColorInput label="Màu chữ" value={textColor} onChange={setTextColor} />
              <div className="col-span-2 border-t border-zinc-200 my-1"></div>
              <ColorInput label="Màu nền nội dung" value={cardColor} onChange={setCardColor} />
              <ColorInput label="Viền thẻ" value={borderColor} onChange={setBorderColor} />
              <ColorInput label="Viền ảnh" value={imageBorderColor} onChange={setImageBorderColor} />
            </div>

            <Input label="Giá tiền" value={price} onChange={setPrice} />
            <Input label="Tên gói" value={packageTitle} onChange={setPackageTitle} />
            <Input label="Tên Studio (phụ, có thể xoá)" value={studioName} onChange={setStudioName} />

            <EditableList title="Dịch vụ" items={serviceItems} setItems={setServiceItems} />
            <EditableList title="Sản phẩm" items={productItems} setItems={setProductItems} />

            <Input label="Địa chỉ" value={address} onChange={setAddress} />
            <Input label="Facebook" value={facebook} onChange={setFacebook} />
            <Input label="Số điện thoại" value={phone} onChange={setPhone} />

            <button
              onClick={downloadPNG}
              className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-4 font-bold text-white shadow-lg active:scale-95 transition"
              style={{ backgroundColor: themeColor }}
            >
              <Download className="h-5 w-5" /> XUẤT FILE PNG HD
            </button>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-3 shadow-sm md:p-4 overflow-hidden flex flex-col items-center justify-start">
          <div className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-400 text-center w-full">Xem trước bản kéo dài (Zoom/Kéo ảnh)</div>
          
          <div ref={measureRef} className="w-full h-0" />

          <div
            className="relative shadow-2xl border border-zinc-100 bg-white transition-all duration-200 ease-out"
            style={{ width: POSTER_W * previewScale, height: POSTER_H * previewScale }}
          >
            <div
              className="absolute left-0 top-0"
              style={{ width: POSTER_W, height: POSTER_H, transform: `scale(${previewScale})`, transformOrigin: "top left" }}
            >
              <PosterPreview data={data} setImgTransform={setImgTransform} previewScale={previewScale} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

type PosterData = {
  photo: string | null;
  imgTransform: { x: number, y: number, scale: number };
  price: string;
  packageTitle: string;
  studioName: string;
  serviceItems: string[];
  productItems: string[];
  address: string;
  facebook: string;
  phone: string;
  themeColor: string;
  borderColor: string;
  textColor: string;
  cardColor: string;
  imageBorderColor: string;
  bgBottomShape: BgBottomShape;
  shapeHeight: number;
  shapeIntensity: number;
};

function PosterPreview({ data, setImgTransform, previewScale }: { 
  data: PosterData, 
  setImgTransform: React.Dispatch<React.SetStateAction<{x: number, y: number, scale: number}>>,
  previewScale: number 
}) {

  const isDragging = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const dragStartTransform = useRef({ x: 0, y: 0 });
  const imgBoxRef = useRef<HTMLDivElement>(null);
  const [imgSize, setImgSize] = useState({ w: L.imageW, h: L.imageH });

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    dragStartTransform.current = { ...data.imgTransform };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = (e.clientX - dragStartPos.current.x) / previewScale;
    const dy = (e.clientY - dragStartPos.current.y) / previewScale;
    setImgTransform(p => ({ ...p, x: dragStartTransform.current.x + dx, y: dragStartTransform.current.y + dy }));
  };

  const onPointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  useEffect(() => {
    const el = imgBoxRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setImgTransform(p => ({ ...p, scale: Math.max(0.1, p.scale - e.deltaY * 0.0015) }));
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [setImgTransform]);

  const getPathData = () => {
    const w = POSTER_W; const h = data.shapeHeight; const inst = data.shapeIntensity;
    switch (data.bgBottomShape) {
      case "flat": return `M0,0 H${w} V${h} H0 Z`;
      case "slant-up": return `M0,0 H${w} V${h - inst} L0,${h} Z`;
      case "slant-down": return `M0,0 H${w} V${h} L0,${h - inst} Z`; // Xéo cao bên trái, thấp bên phải
      case "curved": return `M0,0 H${w} V${h - inst} Q${w/2},${h + inst} 0,${h - inst} Z`;
      case "arch": return `M0,0 H${w} V${h} Q${w/2},${h - inst*3} 0,${h} Z`;
      case "ellipse": return `M0,0 H${w} V${h} A${w/2},${inst} 0 0,1 0,${h} Z`;
      case "wave": return `M0,0 H${w} V${h} C${w*0.75},${h+inst} ${w*0.25},${h-inst} 0,${h} Z`;
      case "zigzag": { let p = `M0,0 H${w} V${h}`; for(let i=1; i<=10; i++) p += ` L${w - (w/10)*i},${(i%2===0) ? h : h - inst}`; return p + " Z"; }
      case "star": { let p = `M0,0 H${w} V${h}`; for(let i=1; i<=4; i++) p += ` L${w - (w/4)*i + (w/4/2)},${h+inst} L${w - (w/4)*i},${h}`; return p + " Z"; }
      default: return `M0,0 H${w} V${h} H0 Z`;
    }
  };

  const baseScale = Math.max(L.imageW / imgSize.w, L.imageH / imgSize.h);
  const renderW = imgSize.w * baseScale * data.imgTransform.scale;
  const renderH = imgSize.h * baseScale * data.imgTransform.scale;

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#fcf9f2] font-quicksand">
      <svg className="absolute inset-x-0 top-0" width={POSTER_W} height={data.shapeHeight + 300}>
        <path d={getPathData()} fill={data.themeColor} />
      </svg>

      <div 
        ref={imgBoxRef}
        className="absolute z-10 overflow-hidden rounded-[42px] bg-[#f3efe4] shadow-[0_15px_30px_rgba(0,0,0,0.25)] group touch-none"
        style={{ 
          left: L.imageX, top: L.imageY, width: L.imageW, height: L.imageH, cursor: 'grab',
          borderWidth: '6px', borderColor: data.imageBorderColor
        }}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
      >
        {!data.photo ? (
          <div className="flex h-full items-center justify-center text-zinc-400 font-bold text-2xl flex-col gap-3">
            <ImagePlus size={48} /> Khu vực hiển thị ảnh
          </div>
        ) : (
          <>
            <img 
              src={data.photo} 
              draggable={false} 
              onLoad={(e) => setImgSize({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
              style={{
                position: 'absolute', 
                left: '50%', top: '50%',
                width: renderW, 
                height: renderH, 
                objectFit: 'fill',
                pointerEvents: 'none',
                transform: `translate(calc(-50% + ${data.imgTransform.x}px), calc(-50% + ${data.imgTransform.y}px))`,
            }}/>
            <div className="absolute top-4 right-4 flex gap-2 z-50 bg-black/50 p-2 rounded-xl text-white opacity-0 group-hover:opacity-100 transition shadow-lg">
              <button title="Phóng to" className="hover:text-green-300" onClick={(e) => { e.stopPropagation(); setImgTransform(p => ({...p, scale: p.scale + 0.1})); }}><ZoomIn size={22}/></button>
              <button title="Thu nhỏ" className="hover:text-green-300" onClick={(e) => { e.stopPropagation(); setImgTransform(p => ({...p, scale: Math.max(0.1, p.scale - 0.1)})); }}><ZoomOut size={22}/></button>
              <button title="Khôi phục" className="hover:text-green-300" onClick={(e) => { e.stopPropagation(); setImgTransform({x:0, y:0, scale: 1}); }}><RotateCcw size={22}/></button>
            </div>
            <div className="absolute top-4 left-4 z-50 bg-black/50 px-3 py-1.5 rounded-lg text-white opacity-0 group-hover:opacity-100 transition shadow-lg text-[16px] font-medium flex items-center gap-2">
               <Move size={18} /> Kéo để di chuyển
            </div>
          </>
        )}
      </div>

      {/* Thẻ nội dung được kéo dài */}
      <div 
        className="absolute z-10 rounded-[44px] flex flex-col px-[60px] py-[40px] shadow-[0_10px_20px_rgba(0,0,0,0.1)]"
        style={{ 
          left: L.cardX, top: L.cardY, width: L.cardW, height: L.cardH, 
          borderWidth: '5px', borderColor: data.borderColor, backgroundColor: data.cardColor 
        }}
      >
        <div className="text-center flex flex-col items-center">
          <div className="text-[96px] font-bold leading-none font-cute tracking-wide" style={{ color: data.themeColor }}>{data.price}</div>
          <div className="mt-1 text-[64px] font-bold leading-none font-cute" style={{ color: data.themeColor }}>{data.packageTitle}</div>
          {data.studioName && (
            <div className="mt-4 text-[24px] font-bold uppercase tracking-[0.2em] text-zinc-500" style={{ color: data.themeColor }}>{data.studioName}</div>
          )}
        </div>
        
        {/* Nới lỏng khoảng cách giữa các phần */}
        <div className="mt-10 flex flex-col gap-8">
          <PosterSection title="Dịch vụ:" color={data.themeColor} textColor={data.textColor} items={data.serviceItems} />
          <PosterSection title="Sản phẩm:" color={data.themeColor} textColor={data.textColor} items={data.productItems} />
        </div>
      </div>

      {/* Footer được hạ sâu xuống phù hợp với Poster 1640px */}
      <div className="absolute left-0 right-0 z-20 flex flex-col items-center text-[28px] font-bold" style={{ top: 1545, color: data.textColor }}>
        <div className="flex items-center gap-3"><MapPin className="h-7 w-7" style={{ color: data.themeColor }} /> <span>{data.address}</span></div>
        <div className="mt-4 flex items-center gap-6">
          <div className="flex items-center gap-2"><Facebook className="h-7 w-7" style={{ color: data.themeColor }} /> <span>{data.facebook}</span></div>
          <div className="text-zinc-400 px-3">|</div>
          <div className="flex items-center gap-2"><Phone className="h-7 w-7" style={{ color: data.themeColor }} /> <span>{data.phone}</span></div>
        </div>
      </div>
    </div>
  );
}

async function drawPosterCanvas(ctx: CanvasRenderingContext2D, data: PosterData) {
  const w = POSTER_W;
  const h = POSTER_H; // Chiều cao mới 1640
  const baseH = data.shapeHeight;
  const inst = data.shapeIntensity;

  ctx.fillStyle = L.bg;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(w, 0);
  switch (data.bgBottomShape) {
    case "flat": ctx.lineTo(w, baseH); ctx.lineTo(0, baseH); break;
    case "slant-up": ctx.lineTo(w, baseH - inst); ctx.lineTo(0, baseH); break;
    case "slant-down": ctx.lineTo(w, baseH); ctx.lineTo(0, baseH - inst); break;
    case "curved": ctx.lineTo(w, baseH - inst); ctx.quadraticCurveTo(w/2, baseH + inst, 0, baseH - inst); break;
    case "arch": ctx.lineTo(w, baseH); ctx.quadraticCurveTo(w/2, baseH - inst*3, 0, baseH); break;
    case "ellipse": ctx.lineTo(w, baseH); ctx.ellipse(w/2, baseH, w/2, inst, 0, 0, Math.PI, false); break;
    case "wave": ctx.lineTo(w, baseH); ctx.bezierCurveTo(w*0.75, baseH + inst, w*0.25, baseH - inst, 0, baseH); break;
    case "zigzag": ctx.lineTo(w, baseH); for(let i=1; i<=10; i++) ctx.lineTo(w - (w/10)*i, (i%2===0) ? baseH : baseH - inst); break;
    case "star": ctx.lineTo(w, baseH); for(let i=1; i<=4; i++) { ctx.lineTo(w - (w/4)*i + (w/4/2), baseH + inst); ctx.lineTo(w - (w/4)*i, baseH); } break;
  }
  ctx.closePath();
  ctx.fillStyle = data.themeColor;
  ctx.fill();
  ctx.restore();

  ctx.save();
  roundRect(ctx, L.imageX, L.imageY, L.imageW, L.imageH, L.imageR);
  
  ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 15;
  ctx.fillStyle = "#f3efe4";
  ctx.fill(); 

  ctx.shadowColor = "transparent";
  ctx.clip(); 
  
  if (data.photo) {
    const img = await loadImage(data.photo);
    const baseScale = Math.max(L.imageW / img.width, L.imageH / img.height);
    const S = baseScale * data.imgTransform.scale;
    const drawW = img.width * S; const drawH = img.height * S;
    const cx = L.imageX + L.imageW / 2 + data.imgTransform.x;
    const cy = L.imageY + L.imageH / 2 + data.imgTransform.y;
    ctx.drawImage(img, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
  }

  ctx.lineWidth = 12; 
  ctx.strokeStyle = data.imageBorderColor;
  ctx.stroke();
  ctx.restore();

  ctx.save();
  roundRect(ctx, L.cardX, L.cardY, L.cardW, L.cardH, L.cardR);
  
  ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 10;
  
  ctx.fillStyle = data.cardColor; 
  ctx.fill(); 
  
  ctx.shadowColor = "transparent";
  ctx.lineWidth = 5; 
  ctx.strokeStyle = data.borderColor; 
  ctx.stroke();
  ctx.restore();

  ctx.textAlign = "center";
  ctx.fillStyle = data.themeColor;
  
  ctx.font = "700 96px 'Fredoka', sans-serif";
  ctx.fillText(data.price, w/2, L.cardY + 120);
  
  ctx.font = "700 64px 'Fredoka', sans-serif";
  ctx.fillText(data.packageTitle, w/2, L.cardY + 195);

  if (data.studioName) {
    ctx.font = "700 24px 'Quicksand', sans-serif";
    ctx.letterSpacing = "4px"; 
    ctx.fillText(data.studioName.toUpperCase(), w/2, L.cardY + 245);
    ctx.letterSpacing = "0px";
  }

  let textY = L.cardY + (data.studioName ? 310 : 270);
  textY = drawCanvasSection(ctx, "Dịch vụ:", data.serviceItems, L.cardX + 60, textY, data.themeColor, data.textColor);
  textY += 20; 
  drawCanvasSection(ctx, "Sản phẩm:", data.productItems, L.cardX + 60, textY, data.themeColor, data.textColor);

  ctx.textAlign = "center";
  ctx.fillStyle = data.textColor;
  ctx.font = "700 28px 'Quicksand', sans-serif";
  ctx.fillStyle = data.themeColor;
  
  ctx.fillText(`📍`, w / 2 - ctx.measureText(`  ${data.address}`).width / 2 - 10, 1560);
  ctx.fillStyle = data.textColor;
  ctx.fillText(`${data.address}`, w / 2, 1560);
  const line2 = `f   ${data.facebook}     |     ☎   ${data.phone}`;
  ctx.fillText(line2, w / 2, 1610);
}

function drawCanvasSection(
  ctx: CanvasRenderingContext2D, title: string, items: string[], x: number, y: number, color: string, textColor: string
) {
  ctx.textAlign = "left";
  ctx.fillStyle = color;
  ctx.font = "700 56px 'Dancing Script', cursive, sans-serif";
  ctx.fillText(title, x, y);
  y += 45;
  ctx.font = "700 27px 'Quicksand', sans-serif";
  for (const item of items) {
    ctx.fillStyle = color;
    ctx.fillText("•", x, y);
    ctx.fillStyle = textColor;
    y = wrapText(ctx, item, x + 25, y, 780, 42); 
    y += 5; 
  }
  return y;
}

function wrapText(
  ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number
) {
  const words = text.split(" ");
  let line = "";
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    if (ctx.measureText(testLine).width > maxWidth && i > 0) {
      ctx.fillText(line.trim(), x, y);
      line = words[i] + " ";
      y += lineHeight;
    } else { line = testLine; }
  }
  ctx.fillText(line.trim(), x, y);
  return y + lineHeight; 
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
}

function roundRect(ctx: any, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath(); ctx.moveTo(x+r, y); ctx.lineTo(x+w-r, y); ctx.quadraticCurveTo(x+w, y, x+w, y+r); ctx.lineTo(x+w, y+h-r); ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h); ctx.lineTo(x+r, y+h); ctx.quadraticCurveTo(x, y+h, x, y+h-r); ctx.lineTo(x, y+r); ctx.quadraticCurveTo(x, y, x+r, y); ctx.closePath();
}

function PosterSection({ title, color, textColor, items }: { title: string, color: string, textColor: string, items: string[] }) {
  return (
    <div className="text-left font-quicksand">
      <h2 className="text-[56px] font-cursive leading-none" style={{ color }}>{title}</h2>
      <ul className="mt-2 space-y-2 text-[27px] font-bold leading-snug" style={{ color: textColor }}>
        {items.map((item, idx) => (
          <li key={idx} className="flex gap-3">
            <span style={{ color }}>•</span> <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-bold text-zinc-500 uppercase">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-zinc-200 transition font-medium text-zinc-700" />
    </label>
  );
}

function ColorInput({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-bold text-zinc-500 uppercase truncate">{label}</span>
      <div className="flex gap-2 items-center">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-12 cursor-pointer rounded-lg border-0 bg-transparent p-0" />
        <span className="text-sm font-mono text-zinc-500 font-bold">{value.toUpperCase()}</span>
      </div>
    </label>
  );
}

function Range({ label, value, min, max, step, onChange }: { label: string, value: number, min: number, max: number, step: number, onChange: (v: number) => void }) {
  return (
    <div className="space-y-2 pt-2 border-t border-zinc-100">
      <div className="flex justify-between text-xs font-bold text-zinc-500 uppercase">
        <span>{label}</span> <span>{value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-zinc-500 h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer" />
    </div>
  );
}

function EditableList({ title, items, setItems }: { title: string, items: string[], setItems: SetList }) {
  return (
    <div className="rounded-xl border border-zinc-200 p-4 bg-white space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-zinc-700 uppercase tracking-wide">{title}</h3>
        <button onClick={() => setItems(p => [...p, ""])} className="p-1.5 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition"><Plus className="h-4 w-4 text-zinc-600" /></button>
      </div>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-2">
            <input value={item} onChange={(e) => {
              const n = [...items]; n[idx] = e.target.value; setItems(n);
            }} className="flex-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400 font-medium text-zinc-700 transition" />
            <button onClick={() => setItems(items.filter((_, i) => i !== idx))} className="text-zinc-400 hover:text-red-500 transition px-1"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
