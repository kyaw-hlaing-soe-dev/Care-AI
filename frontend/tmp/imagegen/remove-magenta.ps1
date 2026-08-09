param(
  [Parameter(Mandatory = $true)][string]$InputPath,
  [Parameter(Mandatory = $true)][string]$OutputPath
)

Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = "Stop"
$drawingAssembly = [System.Drawing.Bitmap].Assembly.Location
$gdiAssembly = Join-Path (Split-Path -Parent $drawingAssembly) "System.Private.Windows.GdiPlus.dll"
$windowsCoreAssembly = Join-Path (Split-Path -Parent $drawingAssembly) "System.Private.Windows.Core.dll"
$drawingPrimitivesAssembly = [System.Drawing.Rectangle].Assembly.Location
Add-Type -ReferencedAssemblies $drawingAssembly, $gdiAssembly, $windowsCoreAssembly, $drawingPrimitivesAssembly -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public static class MagentaAlphaRemover
{
    public static string Remove(string inputPath, string outputPath)
    {
        using (var source = new Bitmap(inputPath))
        using (var bitmap = new Bitmap(source.Width, source.Height, PixelFormat.Format32bppArgb))
        {
            using (var graphics = Graphics.FromImage(bitmap))
            {
                graphics.DrawImageUnscaled(source, 0, 0);
            }

            var rect = new Rectangle(0, 0, bitmap.Width, bitmap.Height);
            var data = bitmap.LockBits(rect, ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
            int byteCount = Math.Abs(data.Stride) * data.Height;
            var pixels = new byte[byteCount];
            Marshal.Copy(data.Scan0, pixels, 0, byteCount);
            long transparent = 0;
            long opaque = 0;
            int minX = bitmap.Width;
            int minY = bitmap.Height;
            int maxX = -1;
            int maxY = -1;
            int rowBytes = Math.Abs(data.Stride);

            for (int i = 0; i < pixels.Length; i += 4)
            {
                int blue = pixels[i];
                int green = pixels[i + 1];
                int red = pixels[i + 2];
                int alpha;

                bool isMagenta = red > 175 && blue > 165 && green < 120 && (red + blue - (green * 2)) > 260;
                bool isMagentaEdge = red > 145 && blue > 135 && green < 155 && (red + blue - (green * 2)) > 170;

                if (isMagenta)
                {
                    alpha = 0;
                    transparent++;
                }
                else if (!isMagentaEdge)
                {
                    alpha = 255;
                    opaque++;
                }
                else
                {
                    alpha = 96;
                }

                pixels[i + 3] = (byte)alpha;
                if (alpha > 100)
                {
                    int y = i / rowBytes;
                    int x = (i % rowBytes) / 4;
                    minX = Math.Min(minX, x);
                    minY = Math.Min(minY, y);
                    maxX = Math.Max(maxX, x);
                    maxY = Math.Max(maxY, y);
                }
            }

            Marshal.Copy(pixels, 0, data.Scan0, byteCount);
            bitmap.UnlockBits(data);
            int padding = 24;
            int cropX = Math.Max(0, minX - padding);
            int cropY = Math.Max(0, minY - padding);
            int cropRight = Math.Min(bitmap.Width - 1, maxX + padding);
            int cropBottom = Math.Min(bitmap.Height - 1, maxY + padding);
            var cropRect = new Rectangle(cropX, cropY, cropRight - cropX + 1, cropBottom - cropY + 1);
            using (var cropped = bitmap.Clone(cropRect, PixelFormat.Format32bppArgb))
            {
                cropped.Save(outputPath, ImageFormat.Png);
                return string.Format("Saved {0} ({1}x{2}); transparent={3} opaque={4}", outputPath, cropped.Width, cropped.Height, transparent, opaque);
            }
        }
    }
}
"@

$resolvedInput = (Resolve-Path -LiteralPath $InputPath).Path
$resolvedOutput = [System.IO.Path]::GetFullPath((Join-Path (Get-Location) $OutputPath))
[MagentaAlphaRemover]::Remove($resolvedInput, $resolvedOutput)
