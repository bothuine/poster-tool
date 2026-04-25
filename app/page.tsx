'use client';

import React, { useEffect, useRef, useState } from "react";
import { Download, ImagePlus, Plus, Trash2, Palette, MapPin, Facebook, Phone, ZoomIn, ZoomOut, Move, RotateCcw } from "lucide-react";

type SetList = React.Dispatch<React.SetStateAction<string[]>>;
type BgBottomShape = "flat" | "slant" | "curved" | "wave" | "zigzag" | "ellipse" | "star" | "arch";

const POSTER_W = 1024;
const POSTER_H = 1536;

const L = {
  bg: "#fcf9f2",
  imageX: 55,
  imageY: 35,
  imageW: 914,
  imageH: 540,
  imageR: 42,
  cardX: 55,
  cardY: 620, 
  cardW: 914,
  cardH: 770, 
  cardR: 44,
};

export default function PosterEditorTool() {
  const [photo, setPhoto] = useState<string | null>(null);
  
  // Transform State cho Tương tác kéo/zoom ảnh
  const [imgTransform, setImgTransform] = useState({ x: 0, y: 0, scale: 1 });

  const [price, setPrice] = useState("2199k");
  const [packageTitle, setPackageTitle] = useState("SON NEWBORN");
  const [studioName, setStudioName] = useState("SON STUDIO BABY & FAMILY");

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
  const [borderColor, setBorderColor] = useState("#628b55");
  const [textColor, setTextColor] = useState("#628b55");
  const [cardColor, setCardColor] = useState("#fcf9f2");

  // States mảng màu
  const [bgBottomShape, setBgBottomShape] = useState<BgBottomShape>("curved");
  const [shapeHeight, setShapeHeight] = useState(620); // Điểm thả mảng màu (Càng nhỏ càng cao)
  const [shapeIntensity, setShapeIntensity] = useState(70);

  const previewWrapRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(1);

  useEffect(() => {
    const resizePreview = () => {
      if (!previewWrapRef.current) return;
      setPreviewScale(Math.min(1, previewWrapRef.current.clientWidth / POSTER_W));
    };
    resizePreview();
    window.addEventListener("resize", resizePreview);
    return () => window.removeEventListener("resize", resizePreview);
  }, []);

  const data: PosterData = {
    photo, imgTransform, price, packageTitle, studioName,
    serviceItems, productItems, address, facebook, phone,
    themeColor, borderColor, textColor, cardColor,
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
      setImgTransform({ x: 0, y: 0, scale: 1 }); // Reset vị trí khi up ảnh mới
    }
  }

  return (
    <main className="min-h-screen bg-zinc-100 p-3 md:p-8 font-quicksand">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Quicksand:wght@500;600;700;800;900&display=swap');
        .font-cursive { font-family: 'Dancing Script', cursive; }
        .font-quicksand { font-family: 'Quicksand', sans-serif; }
      `}} />

      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[430px_1fr]">
        {/* BẢNG ĐIỀU KHIỂN */}
        <section className="rounded-2xl bg-white p-4 shadow-sm md:p-5 h-fit space-y-5">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Poster Pro Editor</h1>
            <p className="text-sm text-zinc-500">Tương tác trực tiếp trên ảnh để căn chỉnh.</p>
          </div>

          <div className="space-y-4">
            {/* Tùy chỉnh Background */}
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
                  <option value="curved">Đường cong Bezier</option>
                  <option value="arch">Vòm cung (Mới)</option>
                  <option value="wave">Đường sóng (Wave)</option>
                  <option value="slant">Cắt chéo (Slant)</option>
                  <option value="ellipse">Vòng Elip</option>
                  <option value="zigzag">Răng cưa (Zigzag)</option>
                  <option value="star">Tia nhọn (Star)</option>
                  <option value="flat">Cắt ngang (Phẳng)</option>
                </select>
                
                <Range 
                  label="Chiều cao nền (Kéo nhỏ để đẩy lên cao)" 
                  value={shapeHeight} 
                  min={300} max={900} step={10} 
                  onChange={setShapeHeight} 
                />

                {bgBottomShape !== 'flat' && (
                  <Range 
                    label="Độ sâu / Cường độ uốn" 
                    value={shapeIntensity} 
                    min={0} max={250} step={5} 
                    onChange={setShapeIntensity} 
                  />
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

            <div className="grid grid-cols-2 gap-3">
              <ColorInput label="Màu chủ đạo" value={themeColor} onChange={setThemeColor} />
              <ColorInput label="Màu chữ" value={textColor} onChange={setTextColor} />
            </div>

            <Input label="Giá tiền" value={price} onChange={setPrice} />
            <Input label="Tên gói" value={packageTitle} onChange={setPackageTitle} />

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

        {/* KHU VỰC PREVIEW */}
        <section ref={previewWrapRef} className="rounded-2xl bg-white p-3 shadow-sm md:p-4 overflow-hidden flex flex-col items-center justify-start">
          <div className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Xem trước (Tương tác Kéo thả & Zoom ảnh)</div>
          <div
            className="relative shadow-2xl border border-zinc-100 bg-white"
            style={{
              width: POSTER_W * previewScale,
              height: POSTER_H * previewScale,
            }}
          >
            <div
              className="absolute left-0 top-0"
              style={{
                width: POSTER_W,
                height: POSTER_H,
                transform: `scale(${previewScale})`,
                transformOrigin: "top left",
              }}
            >
              <PosterPreview 
                data={data} 
                setImgTransform={setImgTransform} 
                previewScale={previewScale} 
              />
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
  bgBottomShape: BgBottomShape;
  shapeHeight: number;
  shapeIntensity: number;
};

// COMPONENT PREVIEW TƯƠNG TÁC ĐƯỢC
function PosterPreview({ data, setImgTransform, previewScale }: { 
  data: PosterData, 
  setImgTransform: React.Dispatch<React.SetStateAction<{x: number, y: number, scale: number}>>,
  previewScale: number 
}) {

  // Kỹ thuật Event Listener cho ảnh để Drag & Scroll
  const isDragging = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const dragStartTransform = useRef({ x: 0, y: 0 });
  const imgBoxRef = useRef<HTMLDivElement>(null);

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

  // Wheel event listener cho scroll chuột
  useEffect(() => {
    const el = imgBoxRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault(); // Chặn cuộn trang khi lăn chuột trên ảnh
      setImgTransform(p => ({ ...p, scale: Math.max(0.1, p.scale - e.deltaY * 0.0015) }));
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [setImgTransform]);

  const getPathData = () => {
    const w = POSTER_W;
    const h = data.shapeHeight;
    const inst = data.shapeIntensity;

    switch (data.bgBottomShape) {
      case "flat": return `M0,0 H${w} V${h} H0 Z`;
      case "slant": return `M0,0 H${w} V${h - inst} L0,${h} Z`;
      case "curved": return `M0,0 H${w} V${h - inst} Q${w/2},${h + inst} 0,${h - inst} Z`;
      case "arch": return `M0,0 H${w} V${h} Q${w/2},${h - inst*3} 0,${h} Z`;
      case "ellipse": return `M0,0 H${w} V${h} A${w/2},${inst} 0 0,1 0,${h} Z`;
      case "wave": return `M0,0 H${w} V${h} C${w*0.75},${h+inst} ${w*0.25},${h-inst} 0,${h} Z`;
      case "zigzag": {
        let p = `M0,0 H${w} V${h}`;
        const steps = 10;
        for(let i=1; i<=steps; i++) {
          p += ` L${w - (w/steps)*i},${(i%2===0) ? h : h - inst}`;
        }
        return p + " Z";
      }
      case "star": {
        let p = `M0,0 H${w} V${h}`;
        const steps = 4;
        for(let i=1; i<=steps; i++) {
          p += ` L${w - (w/steps)*i + (w/steps/2)},${h+inst} L${w - (w/steps)*i},${h}`;
        }
        return p + " Z";
      }
      default: return `M0,0 H${w} V${h} H0 Z`;
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#fcf9f2] font-quicksand">
      <svg className="absolute inset-x-0 top-0" width={POSTER_W} height={data.shapeHeight + 300}>
        <path d={getPathData()} fill={data.themeColor} />
      </svg>

      {/* VÙNG CHỨA ẢNH (Kéo thả & Tương tác) */}
      <div 
        ref={imgBoxRef}
        className="absolute z-10 overflow-hidden rounded-[42px] bg-[#f3efe4] shadow-xl group touch-none"
        style={{ left: L.imageX, top: L.imageY, width: L.imageW, height: L.imageH, cursor: 'grab' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {!data.photo ? (
          <div className="flex h-full items-center justify-center text-zinc-400 font-bold text-2xl flex-col gap-3">
            <ImagePlus size={48} />
            Khu vực hiển thị ảnh
          </div>
        ) : (
          <>
            <img 
              src={data.photo} 
              alt="Uploaded" 
              draggable={false}
              style={{
                position: 'absolute',
                width: '100%', height: '100%',
                objectFit: 'cover',
                pointerEvents: 'none', // Để box cha hứng event
                transform: `translate(${data.imgTransform.x}px, ${data.imgTransform.y}px) scale(${data.imgTransform.scale})`,
              }}
            />
            {/* Thanh công cụ mini cho ảnh */}
            <div className="absolute top-4 right-4 flex gap-2 z-50 bg-black/50 p-2 rounded-xl text-white opacity-0 group-hover:opacity-100 transition shadow-lg">
              <button title="Phóng to" className="hover:text-green-300" onClick={(e) => { e.stopPropagation(); setImgTransform(p => ({...p, scale: p.scale + 0.1})); }}><ZoomIn size={22}/></button>
              <button title="Thu nhỏ" className="hover:text-green-300" onClick={(e) => { e.stopPropagation(); setImgTransform(p => ({...p, scale: Math.max(0.1, p.scale - 0.1)})); }}><ZoomOut size={22}/></button>
              <button title="Khôi phục gốc" className="hover:text-green-300" onClick={(e) => { e.stopPropagation(); setImgTransform({x:0, y:0, scale: 1}); }}><RotateCcw size={22}/></button>
            </div>
            <div className="absolute top-4 left-4 z-50 bg-black/50 px-3 py-1.5 rounded-lg text-white opacity-0 group-hover:opacity-100 transition shadow-lg text-[16px] font-medium flex items-center gap-2">
               <Move size={18} /> Kéo để di chuyển
            </div>
          </>
        )}
      </div>

      <div className="absolute z-10 rounded-[44px] border-[5px] shadow-sm flex flex-col px-[64px] py-[40px]"
        style={{ left: L.cardX, top: L.cardY, width: L.cardW, height: L.cardH, borderColor: data.borderColor, backgroundColor: data.cardColor }}>
        <div className="text-center">
          <div className="text-[82px] font-black leading-none" style={{ color: data.themeColor }}>{data.price}</div>
          <div className="mt-2 text-[54px] font-black leading-tight uppercase" style={{ color: data.themeColor }}>{data.packageTitle}</div>
        </div>
        <div className="mt-8 flex flex-col gap-6">
          <PosterSection title="Dịch vụ:" color={data.themeColor} textColor={data.textColor} items={data.serviceItems} />
          <PosterSection title="Sản phẩm:" color={data.themeColor} textColor={data.textColor} items={data.productItems} />
        </div>
      </div>

      <div className="absolute left-0 right-0 z-20 flex flex-col items-center text-[26px] font-bold" style={{ top: 1425, color: data.textColor }}>
        <div className="flex items-center gap-3">
          <MapPin className="h-7 w-7" style={{ color: data.themeColor }} /> 
          <span>{data.address}</span>
        </div>
        <div className="mt-3 flex items-center gap-6">
          <div className="flex items-center gap-2"><Facebook className="h-7 w-7" style={{ color: data.themeColor }} /> <span>{data.facebook}</span></div>
          <div className="text-zinc-400 px-2">|</div>
          <div className="flex items-center gap-2"><Phone className="h-7 w-7" style={{ color: data.themeColor }} /> <span>{data.phone}</span></div>
        </div>
      </div>
    </div>
  );
}

// THUẬT TOÁN DRAW CANVAS (XUẤT FILE KHỚP VỚI PREVIEW)
async function drawPosterCanvas(ctx: CanvasRenderingContext2D, data: PosterData) {
  const w = POSTER_W;
  const h = POSTER_H;
  const baseH = data.shapeHeight;
  const inst = data.shapeIntensity;

  ctx.fillStyle = L.bg;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(w, 0);

  switch (data.bgBottomShape) {
    case "flat": ctx.lineTo(w, baseH); ctx.lineTo(0, baseH); break;
    case "slant": ctx.lineTo(w, baseH - inst); ctx.lineTo(0, baseH); break;
    case "curved": 
      ctx.lineTo(w, baseH - inst);
      ctx.quadraticCurveTo(w/2, baseH + inst, 0, baseH - inst);
      break;
    case "arch":
      ctx.lineTo(w, baseH);
      ctx.quadraticCurveTo(w/2, baseH - inst*3, 0, baseH);
      break;
    case "ellipse":
      ctx.lineTo(w, baseH);
      ctx.ellipse(w/2, baseH, w/2, inst, 0, 0, Math.PI, false);
      break;
    case "wave":
      ctx.lineTo(w, baseH);
      ctx.bezierCurveTo(w*0.75, baseH + inst, w*0.25, baseH - inst, 0, baseH);
      break;
    case "zigzag":
      ctx.lineTo(w, baseH);
      const zSteps = 10;
      for(let i=1; i<=zSteps; i++) {
        ctx.lineTo(w - (w/zSteps)*i, (i%2===0) ? baseH : baseH - inst);
      }
      break;
    case "star":
      ctx.lineTo(w, baseH);
      const sSteps = 4;
      for(let i=1; i<=sSteps; i++) {
        ctx.lineTo(w - (w/sSteps)*i + (w/sSteps/2), baseH + inst);
        ctx.lineTo(w - (w/sSteps)*i, baseH);
      }
      break;
  }
  ctx.closePath();
  ctx.fillStyle = data.themeColor;
  ctx.fill();
  ctx.restore();

  // VẼ ẢNH THEO MA TRẬN TRANSFORM (Pan & Zoom)
  ctx.save();
  roundRect(ctx, L.imageX, L.imageY, L.imageW, L.imageH, L.imageR);
  ctx.clip();
  ctx.fillStyle = "#f3efe4";
  ctx.fillRect(L.imageX, L.imageY, L.imageW, L.imageH);
  
  if (data.photo) {
    const img = await loadImage(data.photo);
    
    // Thuật toán giả lập object-fit: cover kết hợp translate và scale
    const baseScale = Math.max(L.imageW / img.width, L.imageH / img.height);
    const S = baseScale * data.imgTransform.scale;
    
    const drawW = img.width * S;
    const drawH = img.height * S;
    
    const cx = L.imageX + L.imageW / 2 + data.imgTransform.x;
    const cy = L.imageY + L.imageH / 2 + data.imgTransform.y;
    
    ctx.drawImage(img, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
  }
  ctx.restore();

  // Vẽ Khung Card
  roundRect(ctx, L.cardX, L.cardY, L.cardW, L.cardH, L.cardR);
  ctx.fillStyle = data.cardColor; ctx.fill();
  ctx.lineWidth = 5; ctx.strokeStyle = data.borderColor; ctx.stroke();

  // Vẽ Nội dung Text
  ctx.textAlign = "center";
  ctx.fillStyle = data.themeColor;
  
  ctx.font = "900 82px 'Quicksand', sans-serif";
  ctx.fillText(data.price, w/2, L.cardY + 115);
  
  ctx.font = "900 54px 'Quicksand', sans-serif";
  ctx.fillText(data.packageTitle.toUpperCase(), w/2, L.cardY + 185);

  let textY = L.cardY + 280;
  textY = drawCanvasSection(ctx, "Dịch vụ:", data.serviceItems, L.cardX + 60, textY, data.themeColor, data.textColor);
  textY += 20; 
  drawCanvasSection(ctx, "Sản phẩm:", data.productItems, L.cardX + 60, textY, data.themeColor, data.textColor);

  // Vẽ Footer Canvas
  ctx.textAlign = "center";
  ctx.fillStyle = data.textColor;
  ctx.font = "700 26px 'Quicksand', sans-serif";
  
  ctx.fillStyle = data.themeColor;
  ctx.fillText(`📍`, w / 2 - ctx.measureText(`  ${data.address}`).width / 2 - 10, 1450);
  ctx.fillStyle = data.textColor;
  ctx.fillText(`${data.address}`, w / 2, 1450);
  
  const line2 = `f   ${data.facebook}     |     ☎   ${data.phone}`;
  ctx.fillText(line2, w / 2, 1500);
}

function drawCanvasSection(
  ctx: CanvasRenderingContext2D, title: string, items: string[], x: number, y: number, color: string, textColor: string
) {
  ctx.textAlign = "left";
  ctx.fillStyle = color;
  ctx.font = "700 54px 'Dancing Script', cursive, sans-serif";
  ctx.fillText(title, x, y);

  y += 45;
  ctx.font = "700 28px 'Quicksand', sans-serif";

  for (const item of items) {
    ctx.fillStyle = color;
    ctx.fillText("•", x, y);
    ctx.fillStyle = textColor;
    y = wrapText(ctx, item, x + 30, y, 760, 42);
    y += 8; 
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
    } else {
      line = testLine;
    }
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
      <h2 className="text-[54px] font-cursive leading-tight" style={{ color }}>{title}</h2>
      <ul className="mt-2 space-y-2 text-[28px] font-bold leading-snug" style={{ color: textColor }}>
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
      <span className="text-xs font-bold text-zinc-500 uppercase">{label}</span>
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
