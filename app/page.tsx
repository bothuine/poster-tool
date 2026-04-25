
'use client';

import React, { useEffect, useRef, useState } from "react";
import { Download, ImagePlus, Plus, Trash2, Palette } from "lucide-react";

type SetList = React.Dispatch<React.SetStateAction<string[]>>;

const POSTER_W = 800;
const POSTER_H = 1120;

export default function PosterEditorTool() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [price, setPrice] = useState("800k");
  const [packageTitle, setPackageTitle] = useState("Gói Chụp Thôi Nôi");
  const [studioName, setStudioName] = useState("SON BABY STUDIO");

  const [serviceItems, setServiceItems] = useState([
    "Chụp tại Phim trường Son Studio",
    "2 Bối cảnh chụp",
    "Hỗ trợ 1 trang phục cho bé yêu",
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

  const [themeColor, setThemeColor] = useState("#8b5e3c");
  const [borderColor, setBorderColor] = useState("#c89f68");
  const [textColor, setTextColor] = useState("#5c3b24");
  const [cardColor, setCardColor] = useState("#fff7ed");

  const [imageFit, setImageFit] = useState<"cover" | "contain">("cover");
  const [imageX, setImageX] = useState(50);
  const [imageY, setImageY] = useState(50);

  const posterRef = useRef<HTMLDivElement>(null);
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
  const removeItem = (list: string[], setList: SetList, index: number) => setList(list.filter((_, i) => i !== index));

  // Export bằng Canvas API, không dùng html2canvas.
  // Cách này fix triệt để lỗi ảnh bị méo và footer bị cắt.
  const downloadPNG = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = POSTER_W * 3;
    canvas.height = POSTER_H * 3;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(3, 3);
    await drawPosterToCanvas(ctx, {
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
    });

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
              <h3 className="mb-3 flex items-center gap-2 font-semibold"><Palette className="h-4 w-4" /> Màu & style</h3>

              <label className="block text-sm font-medium">Preset màu nhanh</label>
              <select onChange={(e) => applyPreset(e.target.value)} defaultValue="warmBrown" className="mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2">
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
              <select value={imageFit} onChange={(e) => setImageFit(e.target.value as "cover" | "contain")} className="mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2">
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

            <button onClick={downloadPNG} className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-white shadow-sm" style={{ backgroundColor: themeColor }}>
              <Download className="h-5 w-5" /> Xuất PNG
            </button>
          </div>
        </section>

        <section ref={previewWrapRef} className="rounded-2xl bg-white p-3 shadow-sm md:p-4">
          <div className="mb-3 text-sm text-zinc-500">
            Preview tự scale theo màn hình. File xuất dùng Canvas riêng nên không bị méo/cắt.
          </div>

          <div className="mx-auto" style={{ width: POSTER_W * previewScale, height: POSTER_H * previewScale }}>
            <div style={{ width: POSTER_W, height: POSTER_H, transform: `scale(${previewScale})`, transformOrigin: "top left" }}>
              <PosterPreview
                refEl={posterRef}
                photo={photo}
                imageFit={imageFit}
                imageX={imageX}
                imageY={imageY}
                price={price}
                packageTitle={packageTitle}
                studioName={studioName}
                serviceItems={serviceItems.filter(Boolean)}
                productItems={productItems.filter(Boolean)}
                address={address}
                facebook={facebook}
                phone={phone}
                themeColor={themeColor}
                borderColor={borderColor}
                textColor={textColor}
                cardColor={cardColor}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function PosterPreview(props: any) {
  const {
    refEl, photo, imageFit, imageX, imageY, price, packageTitle, studioName,
    serviceItems, productItems, address, facebook, phone,
    themeColor, borderColor, textColor, cardColor
  } = props;

  return (
    <div ref={refEl} className="relative h-[1120px] w-[800px] overflow-hidden bg-[#f9f4e8]">
      <div className="absolute inset-x-0 top-0 h-[430px]" style={{ backgroundColor: themeColor }} />
      <div className="absolute -left-28 top-[380px] h-40 w-[500px] rotate-[-18deg] bg-[#f9f4e8]" />

      <div
        className="absolute left-[56px] top-[70px] z-10 h-[330px] w-[688px] overflow-hidden rounded-[32px] bg-zinc-200 shadow-sm"
        style={{
          backgroundImage: photo ? `url(${photo})` : "none",
          backgroundSize: imageFit === "cover" ? "cover" : "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: imageFit === "cover" ? `${imageX}% ${imageY}%` : "center",
          backgroundColor: "#f3efe4",
        }}
      >
        {!photo && <div className="flex h-full items-center justify-center text-zinc-400">Upload ảnh chính</div>}
      </div>

      <div
        className="absolute left-[48px] top-[470px] z-10 w-[704px] rounded-[34px] border-[5px] px-[58px] py-[42px]"
        style={{ borderColor, backgroundColor: cardColor }}
      >
        <div className="text-center">
          <div className="text-[58px] font-black leading-none" style={{ color: themeColor }}>{price}</div>
          <div className="mt-2 text-[38px] font-black leading-tight" style={{ color: themeColor }}>{packageTitle}</div>
          <div className="mt-7 text-[24px] font-black uppercase tracking-wide" style={{ color: themeColor }}>{studioName}</div>
        </div>

        <PosterSection title="Dịch vụ:" color={themeColor} textColor={textColor} items={serviceItems} />
        <PosterSection title="Sản phẩm" color={themeColor} textColor={textColor} items={productItems} />
      </div>

      <div className="absolute bottom-[22px] left-0 right-0 z-20 text-center text-[22px] font-medium leading-snug" style={{ color: themeColor }}>
        <div>📍 {address}</div>
        <div className="mt-3">f&nbsp; {facebook} &nbsp; | &nbsp; ☎ {phone}</div>
      </div>
    </div>
  );
}

async function drawPosterToCanvas(
  ctx: CanvasRenderingContext2D,
  data: {
    photo: string | null;
    imageFit: "cover" | "contain";
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
  }
) {
  ctx.clearRect(0, 0, POSTER_W, POSTER_H);

  ctx.fillStyle = "#f9f4e8";
  ctx.fillRect(0, 0, POSTER_W, POSTER_H);

  ctx.fillStyle = data.themeColor;
  ctx.fillRect(0, 0, POSTER_W, 430);

  ctx.save();
  ctx.translate(-112, 380);
  ctx.rotate((-18 * Math.PI) / 180);
  ctx.fillStyle = "#f9f4e8";
  ctx.fillRect(0, 0, 500, 160);
  ctx.restore();

  roundRect(ctx, 56, 70, 688, 330, 32);
  ctx.clip();

  ctx.fillStyle = "#f3efe4";
  ctx.fillRect(56, 70, 688, 330);

  if (data.photo) {
    const img = await loadImage(data.photo);
    if (data.imageFit === "cover") {
      drawImageCover(ctx, img, 56, 70, 688, 330, data.imageX / 100, data.imageY / 100);
    } else {
      drawImageContain(ctx, img, 56, 70, 688, 330);
    }
  }

  ctx.restore();

  roundRect(ctx, 48, 470, 704, 500, 34);
  ctx.fillStyle = data.cardColor;
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = data.borderColor;
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = data.themeColor;
  ctx.font = "900 58px Arial, sans-serif";
  ctx.fillText(data.price, 400, 555);

  ctx.font = "900 38px Arial, sans-serif";
  ctx.fillText(data.packageTitle, 400, 605);

  ctx.font = "900 24px Arial, sans-serif";
  ctx.fillText(data.studioName.toUpperCase(), 400, 665);

  let y = 735;
  y = drawSection(ctx, "Dịch vụ:", data.serviceItems, 130, y, data.themeColor, data.textColor);
  y += 18;
  drawSection(ctx, "Sản phẩm", data.productItems, 130, y, data.themeColor, data.textColor);

  ctx.textAlign = "center";
  ctx.fillStyle = data.themeColor;
  ctx.font = "500 22px Arial, sans-serif";
  ctx.fillText(`📍 ${data.address}`, 400, 1050);
  ctx.fillText(`f  ${data.facebook}   |   ☎  ${data.phone}`, 400, 1085);
}

function drawSection(ctx: CanvasRenderingContext2D, title: string, items: string[], x: number, y: number, color: string, textColor: string) {
  ctx.textAlign = "left";
  ctx.fillStyle = color;
  ctx.font = "900 31px Arial, sans-serif";
  ctx.fillText(title, x, y);

  y += 35;
  ctx.fillStyle = textColor;
  ctx.font = "800 21px Arial, sans-serif";

  for (const item of items) {
    ctx.fillStyle = color;
    ctx.fillText("•", x, y);
    ctx.fillStyle = textColor;
    y = wrapText(ctx, item, x + 30, y, 540, 26);
    y += 9;
  }

  return y;
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
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
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = src;
  });
}

function drawImageCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number, focusX: number, focusY: number) {
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

function drawImageContain(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
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

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
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

function PosterSection({ title, color, textColor, items }: { title: string; color: string; textColor: string; items: string[] }) {
  return (
    <div className="mt-7">
      <h2 className="text-[31px] font-black leading-tight" style={{ color }}>{title}</h2>
      <ul className="mt-3 space-y-2 text-[21px] font-extrabold leading-snug" style={{ color: textColor }}>
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

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-300" />
    </label>
  );
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-medium">{label}</span>
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 h-10 w-full cursor-pointer rounded-lg" />
    </label>
  );
}

function Range({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void }) {
  return (
    <label className="block">
      <div className="mb-1 flex justify-between text-sm">
        <span>{label}</span>
        <span className="text-zinc-500">{value.toFixed(0)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full" />
    </label>
  );
}

function EditableList({ title, items, setItems, updateItem, addItem, removeItem }: { title: string; items: string[]; setItems: SetList; updateItem: (list: string[], setList: SetList, index: number, value: string) => void; addItem: (setList: SetList) => void; removeItem: (list: string[], setList: SetList, index: number) => void }) {
  return (
    <div className="rounded-xl border border-zinc-200 p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        <button onClick={() => addItem(setItems)} className="flex items-center gap-1 rounded-lg bg-zinc-100 px-2 py-1 text-sm hover:bg-zinc-200">
          <Plus className="h-4 w-4" /> Thêm dòng
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-2">
            <input value={item} onChange={(e) => updateItem(items, setItems, idx, e.target.value)} className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300" placeholder={`Dòng ${idx + 1}`} />
            <button onClick={() => removeItem(items, setItems, idx)} className="rounded-lg border border-zinc-300 px-2 hover:bg-zinc-100" title="Xóa dòng">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
