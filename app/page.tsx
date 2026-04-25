'use client';

import React, { useEffect, useRef, useState } from "react";
import { Download, ImagePlus, Plus, Trash2, Palette, MapPin, Facebook, Phone } from "lucide-react";

type SetList = React.Dispatch<React.SetStateAction<string[]>>;
type FitMode = "cover" | "contain";

// Kích thước chuẩn tỷ lệ 2:3
const POSTER_W = 1024;
const POSTER_H = 1536;

// Cấu trúc lại toàn bộ Layout để vừa vặn, không bị tràn chữ
const L = {
  bg: "#f9f4e8",
  topH: 580, // Chiều cao mảng xanh lá bên trên

  imageX: 55,
  imageY: 35,
  imageW: 914,
  imageH: 540,
  imageR: 42,

  cardX: 55,
  cardY: 600, // Đẩy card lên một chút
  cardW: 914,
  cardH: 810, // Tăng chiều cao card để chứa đủ 2 list Dịch vụ và Sản phẩm
  cardR: 44,
};

export default function PosterEditorTool() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [price, setPrice] = useState("2299k");
  const [packageTitle, setPackageTitle] = useState("Gói Chụp Thôi Nôi");
  const [studioName, setStudioName] = useState("SON BABY STUDIO");

  const [serviceItems, setServiceItems] = useState([
    "Chụp tại Phim trường Son Studio",
    "3 Bối cảnh chụp",
    "Hỗ trợ 2 trang phục cho bé yêu và ba mẹ",
    "Hỗ trợ chụp cùng ba mẹ",
  ]);

  const [productItems, setProductItems] = useState([
    "11 ảnh chỉnh sửa hoàn thiện",
    "10 ảnh in lụa 13x18cm",
    "1 Ảnh gỗ 40x60cm",
    "Trả toàn bộ ảnh chụp và ảnh chỉnh sửa full size",
    "Album đựng ảnh 13x18",
  ]);

  const [address, setAddress] = useState("43 Quang Trung, Eakar (Đường 720)");
  const [facebook, setFacebook] = useState("Son Studio Baby & Family");
  const [phone, setPhone] = useState("0909 200 998");

  const [themeColor, setThemeColor] = useState("#57903f");
  const [borderColor, setBorderColor] = useState("#57903f");
  const [textColor, setTextColor] = useState("#6a3f25");
  const [cardColor, setCardColor] = useState("#fffaf0");

  const [imageFit, setImageFit] = useState<FitMode>("cover");
  const [imageX, setImageX] = useState(50);
  const [imageY, setImageY] = useState(50);

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

  const applyPreset = (type: string) => {
    const presets: Record<string, string[]> = {
      babyGreen: ["#57903f", "#57903f", "#6a3f25", "#fffaf0"],
      luxuryGold: ["#0f172a", "#d4af37", "#5b4636", "#fff7e6"],
      softPink: ["#d97b93", "#c75f7a", "#7a3f4d", "#fff5f7"],
      warmBrown: ["#8b5e3c", "#c89f68", "#5c3b24", "#fff7ed"],
      minimalBlack: ["#111111", "#888888", "#333333", "#ffffff"],
      saleRed: ["#ef4444", "#111111", "#5a2a2a", "#fff7f0"],
    };

    const p = presets[type];
    if (!p) return;
    setThemeColor(p[0]);
    setBorderColor(p[1]);
    setTextColor(p[2]);
    setCardColor(p[3]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(URL.createObjectURL(file));
  };

  const updateItem = (list: string[], setList: SetList, index: number, value: string) => {
    const next = [...list];
    next[index] = value;
    setList(next);
  };

  const addItem = (setList: SetList) => setList((prev) => [...prev, ""]);
  const removeItem = (list: string[], setList: SetList, index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  const data: PosterData = {
    photo,
    imageFit,
    imageX,
    imageY,
    price,
    packageTitle,
    studioName,
    serviceItems: serviceItems.filter(Boolean),
    productItems: productItems.filter(Boolean),
    address,
    facebook,
    phone,
    themeColor,
    borderColor,
    textColor,
    cardColor,
  };

  const downloadPNG = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = POSTER_W * 2;
    canvas.height = POSTER_H * 2;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(2, 2);
    await drawPosterCanvas(ctx, data);

    const link = document.createElement("a");
    link.download = `poster-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <main className="min-h-screen bg-zinc-100 p-3 md:p-8">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[430px_1fr]">
        <section className="rounded-2xl bg-white p-4 shadow-sm md:p-5">
          <h1 className="text-2xl font-bold text-zinc-900">Poster Editor</h1>
          <p className="mt-1 text-sm text-zinc-500">Upload ảnh, chỉnh màu, nội dung, căn ảnh rồi xuất PNG.</p>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="text-sm font-medium">Ảnh chính</span>
              <div className="mt-2 flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 p-5 hover:bg-zinc-50">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                <div className="text-center text-sm text-zinc-500">
                  <ImagePlus className="mx-auto mb-2 h-7 w-7" />
                  Bấm để upload ảnh
                </div>
              </div>
            </label>

            <div className="rounded-xl border border-zinc-200 p-3">
              <h3 className="mb-3 flex items-center gap-2 font-semibold">
                <Palette className="h-4 w-4" /> Màu & style
              </h3>

              <label className="block text-sm font-medium">Preset màu nhanh</label>
              <select
                onChange={(e) => applyPreset(e.target.value)}
                defaultValue="babyGreen"
                className="mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2"
              >
                <option value="babyGreen">Baby Green</option>
                <option value="luxuryGold">Luxury Gold</option>
                <option value="softPink">Soft Pink</option>
                <option value="warmBrown">Warm Brown</option>
                <option value="minimalBlack">Minimal Black</option>
                <option value="saleRed">Sale Red</option>
              </select>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <ColorInput label="Màu chủ đạo" value={themeColor} onChange={setThemeColor} />
                <ColorInput label="Màu viền" value={borderColor} onChange={setBorderColor} />
                <ColorInput label="Màu chữ nội dung" value={textColor} onChange={setTextColor} />
                <ColorInput label="Màu khung nội dung" value={cardColor} onChange={setCardColor} />
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 p-3">
              <h3 className="mb-3 font-semibold">Căn ảnh upload</h3>
              <label className="block text-sm font-medium">Kiểu hiển thị ảnh</label>
              <select
                value={imageFit}
                onChange={(e) => setImageFit(e.target.value as FitMode)}
                className="mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2"
              >
                <option value="cover">Fill khung đẹp nhất, không méo ảnh</option>
                <option value="contain">Giữ nguyên ảnh, không crop</option>
              </select>

              {imageFit === "cover" && (
                <div className="mt-3 space-y-3">
                  <Range label="Dịch ngang" value={imageX} min={0} max={100} step={1} onChange={setImageX} />
                  <Range label="Dịch dọc" value={imageY} min={0} max={100} step={1} onChange={setImageY} />
                </div>
              )}
            </div>

            <Input label="Giá" value={price} onChange={setPrice} />
            <Input label="Tên gói" value={packageTitle} onChange={setPackageTitle} />
            <Input label="Tên studio" value={studioName} onChange={setStudioName} />

            <EditableList title="Nội dung Dịch vụ" items={serviceItems} setItems={setServiceItems} updateItem={updateItem} addItem={addItem} removeItem={removeItem} />
            <EditableList title="Nội dung Sản phẩm" items={productItems} setItems={setProductItems} updateItem={updateItem} addItem={addItem} removeItem={removeItem} />

            <Input label="Địa chỉ" value={address} onChange={setAddress} />
            <Input label="Facebook" value={facebook} onChange={setFacebook} />
            <Input label="Số điện thoại" value={phone} onChange={setPhone} />

            <button
              onClick={downloadPNG}
              className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-white shadow-sm"
              style={{ backgroundColor: themeColor }}
            >
              <Download className="h-5 w-5" /> Xuất PNG
            </button>
          </div>
        </section>

        <section ref={previewWrapRef} className="rounded-2xl bg-white p-3 shadow-sm md:p-4">
          <div className="mb-3 text-sm text-zinc-500">
            Preview tỷ lệ 2:3 giống mẫu. File xuất không méo ảnh.
          </div>

          <div
            className="mx-auto"
            style={{
              width: POSTER_W * previewScale,
              height: POSTER_H * previewScale,
            }}
          >
            <div
              style={{
                width: POSTER_W,
                height: POSTER_H,
                transform: `scale(${previewScale})`,
                transformOrigin: "top left",
              }}
            >
              <PosterPreview {...data} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

type PosterData = {
  photo: string | null;
  imageFit: FitMode;
  imageX: number;
  imageY: number;
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
};

function PosterPreview(data: PosterData) {
  const imageBackground = data.photo
    ? {
        backgroundImage: `url(${data.photo})`,
        backgroundSize: data.imageFit === "cover" ? "cover" : "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: data.imageFit === "cover" ? `${data.imageX}% ${data.imageY}%` : "center",
      }
    : {};

  return (
    <div className="relative h-[1536px] w-[1024px] overflow-hidden bg-[#f9f4e8]">
      <div className="absolute inset-x-0 top-0 h-[580px]" style={{ backgroundColor: data.themeColor }} />
      <div className="absolute -left-[145px] top-[530px] h-[180px] w-[560px] rotate-[-18deg] bg-[#f9f4e8]" />

      <div
        className="absolute z-10 overflow-hidden rounded-[42px] bg-[#f3efe4] shadow-sm"
        style={{
          left: L.imageX,
          top: L.imageY,
          width: L.imageW,
          height: L.imageH,
          ...imageBackground,
        }}
      >
        {!data.photo && (
          <div className="flex h-full items-center justify-center text-zinc-400">
            Upload ảnh chính
          </div>
        )}
      </div>

      <div
        className="absolute z-10 overflow-hidden rounded-[44px] border-[6px] shadow-sm"
        style={{
          left: L.cardX,
          top: L.cardY,
          width: L.cardW,
          height: L.cardH,
          borderColor: data.borderColor,
          backgroundColor: data.cardColor,
        }}
      >
        <div className="flex h-full flex-col px-[64px] py-[50px]">
          <div className="text-center">
            <div className="text-[72px] font-black leading-none" style={{ color: data.themeColor }}>{data.price}</div>
            <div className="mt-2 text-[46px] font-black leading-tight" style={{ color: data.themeColor }}>{data.packageTitle}</div>
            <div className="mt-4 text-[28px] font-black uppercase tracking-wide" style={{ color: data.themeColor }}>{data.studioName}</div>
          </div>

          <div className="mt-10 flex flex-col gap-6">
            <PosterSection title="Dịch vụ:" color={data.themeColor} textColor={data.textColor} items={data.serviceItems} />
            <PosterSection title="Sản phẩm" color={data.themeColor} textColor={data.textColor} items={data.productItems} />
          </div>
        </div>
      </div>

      <div
        className="absolute left-0 right-0 z-20 flex flex-col items-center text-[26px] font-medium leading-snug"
        style={{ top: 1445, color: data.themeColor }}
      >
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6" strokeWidth={2.5} />
          <span>{data.address}</span>
        </div>
        <div className="mt-3 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Facebook className="h-6 w-6" strokeWidth={2.5} />
            <span>{data.facebook}</span>
          </div>
          <div className="text-zinc-400">|</div>
          <div className="flex items-center gap-2">
            <Phone className="h-6 w-6" strokeWidth={2.5} />
            <span>{data.phone}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

async function drawPosterCanvas(ctx: CanvasRenderingContext2D, data: PosterData) {
  ctx.clearRect(0, 0, POSTER_W, POSTER_H);

  // Background
  ctx.fillStyle = L.bg;
  ctx.fillRect(0, 0, POSTER_W, POSTER_H);

  // Top header color
  ctx.fillStyle = data.themeColor;
  ctx.fillRect(0, 0, POSTER_W, L.topH);

  // Slant line
  ctx.save();
  ctx.translate(-145, 530);
  ctx.rotate((-18 * Math.PI) / 180);
  ctx.fillStyle = L.bg;
  ctx.fillRect(0, 0, 560, 180);
  ctx.restore();

  // Draw main image
  ctx.save();
  roundRect(ctx, L.imageX, L.imageY, L.imageW, L.imageH, L.imageR);
  ctx.clip();

  ctx.fillStyle = "#f3efe4";
  ctx.fillRect(L.imageX, L.imageY, L.imageW, L.imageH);

  if (data.photo) {
    const img = await loadImage(data.photo);
    if (data.imageFit === "cover") {
      drawImageCover(ctx, img, L.imageX, L.imageY, L.imageW, L.imageH, data.imageX / 100, data.imageY / 100);
    } else {
      drawImageContain(ctx, img, L.imageX, L.imageY, L.imageW, L.imageH);
    }
  } else {
    ctx.fillStyle = "#9ca3af";
    ctx.font = "400 18px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Upload ảnh chính", POSTER_W / 2, 310);
  }

  ctx.restore();

  // Draw card
  roundRect(ctx, L.cardX, L.cardY, L.cardW, L.cardH, L.cardR);
  ctx.fillStyle = data.cardColor;
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = data.borderColor;
  ctx.stroke();

  // Draw card content (Synced perfectly with HTML preview math)
  ctx.textAlign = "center";
  ctx.fillStyle = data.themeColor;

  ctx.font = "900 72px Arial, sans-serif";
  ctx.fillText(data.price, POSTER_W / 2, L.cardY + 110);

  ctx.font = "900 46px Arial, sans-serif";
  ctx.fillText(data.packageTitle, POSTER_W / 2, L.cardY + 175);

  ctx.font = "900 28px Arial, sans-serif";
  ctx.fillText(data.studioName.toUpperCase(), POSTER_W / 2, L.cardY + 230);

  let y = L.cardY + 310;
  y = drawCanvasSection(ctx, "Dịch vụ:", data.serviceItems, L.cardX + 70, y, data.themeColor, data.textColor);
  y += 35;
  drawCanvasSection(ctx, "Sản phẩm", data.productItems, L.cardX + 70, y, data.themeColor, data.textColor);

  // Draw Footer
  ctx.textAlign = "center";
  ctx.fillStyle = data.themeColor;
  ctx.font = "500 26px Arial, sans-serif";
  ctx.fillText(`📍  ${data.address}`, POSTER_W / 2, 1470);
  ctx.fillText(`f   ${data.facebook}    |    ☎   ${data.phone}`, POSTER_W / 2, 1515);
}

function drawCanvasSection(
  ctx: CanvasRenderingContext2D,
  title: string,
  items: string[],
  x: number,
  y: number,
  color: string,
  textColor: string
) {
  ctx.textAlign = "left";
  ctx.fillStyle = color;
  ctx.font = "900 36px Arial, sans-serif";
  ctx.fillText(title, x, y);

  y += 40;
  ctx.font = "800 26px Arial, sans-serif";

  for (const item of items) {
    ctx.fillStyle = color;
    ctx.fillText("•", x, y);

    ctx.fillStyle = textColor;
    y = wrapText(ctx, item, x + 35, y, 750, 34);
    y += 8;
  }

  return y;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
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
  return y;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  focusX: number,
  focusY: number
) {
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const boxRatio = w / h;

  let sw = img.naturalWidth;
  let sh = img.naturalHeight;

  if (imgRatio > boxRatio) {
    sh = img.naturalHeight;
    sw = sh * boxRatio;
  } else {
    sw = img.naturalWidth;
    sh = sw / boxRatio;
  }

  const sx = Math.max(0, Math.min(img.naturalWidth - sw, (img.naturalWidth - sw) * focusX));
  const sy = Math.max(0, Math.min(img.naturalHeight - sh, (img.naturalHeight - sh) * focusY));

  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function drawImageContain(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const boxRatio = w / h;

  let dw = w;
  let dh = h;

  if (imgRatio > boxRatio) {
    dw = w;
    dh = w / imgRatio;
  } else {
    dh = h;
    dw = h * imgRatio;
  }

  const dx = x + (w - dw) / 2;
  const dy = y + (h - dh) / 2;

  ctx.drawImage(img, dx, dy, dw, dh);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function PosterSection({
  title,
  color,
  textColor,
  items,
}: {
  title: string;
  color: string;
  textColor: string;
  items: string[];
}) {
  return (
    <div className="text-left">
      <h2 className="text-[36px] font-black leading-tight" style={{ color }}>{title}</h2>
      <ul className="mt-3 space-y-2 text-[26px] font-extrabold leading-snug" style={{ color: textColor }}>
        {items.map((item, idx) => (
          <li key={idx} className="flex gap-3">
            <span style={{ color }}>•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-300"
      />
    </label>
  );
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium">{label}</span>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 h-10 w-full cursor-pointer rounded-lg"
      />
    </label>
  );
}

function Range({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <div className="mb-1 flex justify-between text-sm">
        <span>{label}</span>
        <span className="text-zinc-500">{value.toFixed(0)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </label>
  );
}

function EditableList({
  title,
  items,
  setItems,
  updateItem,
  addItem,
  removeItem,
}: {
  title: string;
  items: string[];
  setItems: SetList;
  updateItem: (list: string[], setList: SetList, index: number, value: string) => void;
  addItem: (setList: SetList) => void;
  removeItem: (list: string[], setList: SetList, index: number) => void;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        <button
          onClick={() => addItem(setItems)}
          className="flex items-center gap-1 rounded-lg bg-zinc-100 px-2 py-1 text-sm hover:bg-zinc-200"
        >
          <Plus className="h-4 w-4" /> Thêm dòng
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              value={item}
              onChange={(e) => updateItem(items, setItems, idx, e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
              placeholder={`Dòng ${idx + 1}`}
            />
            <button
              onClick={() => removeItem(items, setItems, idx)}
              className="rounded-lg border border-zinc-300 px-2 hover:bg-zinc-100"
              title="Xóa dòng"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
