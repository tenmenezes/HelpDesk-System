"use client";

import {
  ArrowLeftIcon,
  CameraIcon,
  UserIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import {
  Cropper,
  CropperCropArea,
  CropperDescription,
  CropperImage,
} from "@/components/ui/cropper";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { mutate } from "swr";

// Define type for pixel crop area
type Area = { x: number; y: number; width: number; height: number };

// Helper function to create a cropped image blob
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // Needed for canvas Tainted check
    image.src = url;
  });

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  outputWidth: number = pixelCrop.width, // Optional: specify output size
  outputHeight: number = pixelCrop.height,
): Promise<Blob | null> {
  try {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return null;
    }

    // Set canvas size to desired output size
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    // Draw the cropped image onto the canvas
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      outputWidth, // Draw onto the output size
      outputHeight,
    );

    // Convert canvas to blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg"); // Specify format and quality if needed
    });
  } catch (error) {
    console.error("Error in getCroppedImg:", error);
    return null;
  }
}

async function uploadAvatarToServer(blob: Blob, userId: number) {
  const form = new FormData();
  form.append("avatar", blob, "avatar.jpg");
  form.append("userId", String(userId));

  const res = await fetch("/api/usuarios/upload-photo", {
    method: "POST",
    body: form,
  });

  return res.json();
}

function getUploadErrorMessage(error: string) {
  if (error.includes("exceeds the maximum size")) {
    return "O arquivo selecionado excede o limite de 4 MB.";
  }

  if (error.includes("is not an accepted file type")) {
    return "Formato invalido. Use JPG, PNG ou WEBP.";
  }

  return error;
}

export default function ComponentProfileCrop({
  userId,
  currentImageUrl,
  userName,
}: {
  userId?: number;
  currentImageUrl?: string | null;
  userName?: string;
}) {
  const { refreshUser } = useAuth();
  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearErrors,
      getInputProps,
    },
  ] = useFileUpload({
    accept: "image/jpeg,image/png,image/webp",
    maxSize: 4 * 1024 * 1024,
  });

  const previewUrl = files[0]?.preview || null;
  const fileId = files[0]?.id;

  const [finalImageUrl, setFinalImageUrl] = useState<string | null>(
    currentImageUrl ?? null
  );
  const [mounted, setMounted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Ref to track the previous file ID to detect new uploads
  const previousFileIdRef = useRef<string | undefined | null>(null);

  // State to store the desired crop area in pixels
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // State for zoom level
  const [zoom, setZoom] = useState(1);
  const safeImageUrl = mounted ? finalImageUrl : null;
  const triggerAriaLabel = safeImageUrl ? "Trocar foto" : "Enviar foto";

  // Callback for Cropper to provide crop data - Wrap with useCallback
  const handleCropChange = useCallback((pixels: Area | null) => {
    setCroppedAreaPixels(pixels);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleApply = async () => {
    if (!previewUrl || !fileId || !croppedAreaPixels) {
      console.error("Missing data for apply:", {
        croppedAreaPixels,
        fileId,
        previewUrl,
      });
      if (fileId) {
        removeFile(fileId);
        setCroppedAreaPixels(null);
      }
      return;
    }

    try {
      setIsUploading(true);
      const croppedBlob = await getCroppedImg(previewUrl, croppedAreaPixels);
      if (!croppedBlob)
        throw new Error("Nao foi possivel preparar a imagem para envio.");

      if (!userId) {
        toast.error("Usuario nao identificado para atualizar a foto.");
        return;
      }

      const uploadResp = await uploadAvatarToServer(croppedBlob, userId);

      if (uploadResp && uploadResp.success && uploadResp.url) {
        setFinalImageUrl(uploadResp.url);
        setIsDialogOpen(false);
        if (fileId) removeFile(fileId);
        clearErrors();

        try {
          await refreshUser();
          mutate("usuarios");
        } catch (e) {
          console.error("Erro ao atualizar cache:", e);
        }

        toast.success("Foto de perfil atualizada com sucesso.");
      } else {
        toast.error(uploadResp?.message || "Nao foi possivel atualizar a foto.");
      }
    } catch (error) {
      console.error("Error during apply:", error);
      toast.error("Erro ao processar a imagem selecionada.");
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    setFinalImageUrl(currentImageUrl ?? null);
  }, [currentImageUrl]);

  useEffect(() => {
    const currentFinalUrl = finalImageUrl;
    return () => {
      if (currentFinalUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(currentFinalUrl);
      }
    };
  }, [finalImageUrl]);

  useEffect(() => {
    if (fileId && fileId !== previousFileIdRef.current) {
      setIsDialogOpen(true);
      setCroppedAreaPixels(null);
      setZoom(1);
    }
    previousFileIdRef.current = fileId;
  }, [fileId]);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="relative inline-flex">
        <button
          aria-label={triggerAriaLabel}
          className="group relative flex size-32 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-input border-dashed bg-muted/30 outline-none transition-colors hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[dragging=true]:bg-accent/50"
          data-dragging={isDragging || undefined}
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          type="button"
        >
          {safeImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={`Foto de perfil de ${userName ?? "usuario"}`}
              className="size-full object-cover"
              height={128}
              src={safeImageUrl}
              style={{ objectFit: "cover" }}
              width={128}
            />
          ) : (
            <div
              aria-hidden="true"
              className="flex flex-col items-center gap-2 text-muted-foreground"
            >
              <UserIcon className="size-12 opacity-70" />
              <span className="text-xs font-medium">Sem foto</span>
            </div>
          )}

          <div className="absolute inset-0 flex items-end justify-center from-black/55 via-black/10 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
            <span className="inline-flex items-center gap-2 rounded-full bg-background/95 px-3 py-1 text-xs font-medium text-foreground">
              <CameraIcon className="h-3.5 w-3.5" />
              Alterar foto
            </span>
          </div>
        </button>
        <input
          {...getInputProps()}
          aria-label="Selecionar foto de perfil"
          className="sr-only"
          tabIndex={-1}
        />
      </div>

      <div className="space-y-1 text-center">
        <p className="text-sm font-medium">Foto de perfil</p>
        <p className="text-xs text-muted-foreground">
          Envie uma imagem JPG, PNG ou WEBP com ate 4 MB.
        </p>
      </div>

      {errors.length > 0 && (
        <div className="w-full rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {getUploadErrorMessage(errors[0])}
        </div>
      )}

      <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
        <DialogContent className="gap-0 p-0 sm:max-w-140 *:[button]:hidden">
          <DialogDescription className="sr-only">
            Ajustar recorte da foto de perfil
          </DialogDescription>
          <DialogHeader className="contents space-y-0 text-left">
            <DialogTitle className="flex items-center justify-between border-b p-4 text-base">
              <div className="flex items-center gap-2">
                <Button
                  aria-label="Cancelar"
                  className="-my-1 opacity-60 cursor-pointer"
                  onClick={() => setIsDialogOpen(false)}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <ArrowLeftIcon aria-hidden="true" />
                </Button>
                <span>Ajustar foto</span>
              </div>
              <Button
                autoFocus
                className="-my-1 cursor-pointer"
                disabled={!previewUrl || isUploading}
                onClick={handleApply}
              >
                {isUploading ? "Salvando..." : "Salvar foto"}
              </Button>
            </DialogTitle>
          </DialogHeader>
          {previewUrl && (
            <Cropper
              className="h-96 sm:h-120"
              image={previewUrl}
              onCropChange={handleCropChange}
              onZoomChange={setZoom}
              zoom={zoom}
            >
              <CropperDescription />
              <CropperImage />
              <CropperCropArea />
            </Cropper>
          )}
          <DialogFooter className="border-t px-4 py-6">
            <div className="mx-auto flex w-full max-w-80 items-center gap-4">
              <ZoomOutIcon
                aria-hidden="true"
                className="shrink-0 opacity-60"
                size={16}
              />
              <Slider
                aria-label="Controle de zoom"
                defaultValue={[1]}
                max={3}
                min={1}
                onValueChange={(value) => setZoom(value[0])}
                step={0.1}
                value={[zoom]}
              />
              <ZoomInIcon
                aria-hidden="true"
                className="shrink-0 opacity-60"
                size={16}
              />
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <p
        aria-live="polite"
        className="mt-2 text-muted-foreground text-xs"
        role="region"
      >
        Clique na imagem para escolher um arquivo e ajustar o recorte.
      </p>
    </div>
  );
}
