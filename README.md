# ROOP-REKHA
### AI-Based Automated Urban Parcel Mapping & Cadastral Feature Extraction System using Drone Imagery

![Aerial survey reference](https://roop-rekha.vercel.app/assets/indore-aerial-CEBBLULo.jpg)

**Live Demo:** [roop-rekha.vercel.app](https://roop-rekha.vercel.app/) · [Command Centre](https://roop-rekha.vercel.app/dashboard) · [Web-GIS Map](https://roop-rekha.vercel.app/dashboard/map) · [AI Extraction Viewer](https://roop-rekha.vercel.app/dashboard/extraction)

ROOP-REKHA converts raw drone and LiDAR aerial surveys into topologically regularized, legally reviewable urban land parcels — replacing multi-year manual revenue mapping with an elevation-aware AI pipeline and a confidence-driven human verification loop. The platform is designed to run as a software layer over India's existing NAKSHA / SVAMITVA drone-survey infrastructure, with zero new hardware required.

---

## Problem Statement

- Manual digitization of drone imagery into usable parcel maps takes **weeks per Urban Local Body (ULB)** — the single largest recurring cost in cadastral survey programmes.
- Land disputes remain one of India's most common categories of civil litigation, rooted in outdated or missing cadastral records.
- Dense Indian urban fabric — overlapping structures, narrow lanes, irregular plots — breaks RGB-only segmentation models trained on Western suburban layouts.
- Existing digitization workflows have no built-in geometry-validity or encroachment check, pushing errors downstream into legally binding records.

---

## Functional Requirements

1. **Biomechanical-equivalent Landmark Extraction (Geospatial Feature Extraction):**
   - Use a fine-tuned **SAM 2 / SAMGeo** and **DeepLabv3+ (ResNet-101)** / **U-Net** ensemble to extract per-pixel building footprint, parcel boundary, and road/access-corridor masks from orthorectified drone imagery (ORI).
   - Fuse **RGB + DSM/DTM elevation channels** as a multi-band input so the model separates structures by height, not just colour — critical for touching/overlapping buildings.

2. **Geometric & Topological Math:**
   - **Douglas-Peucker Simplification:** Reduce raw mask-to-polygon vertex noise while preserving shape fidelity.
   - **Orthogonalization:** Snap near-90° building corners to true right angles within a configurable angular tolerance.
   - **Validity Gate (PostGIS):** Run `ST_IsValid`, `ST_Overlaps`, `ST_Simplify` on every generated polygon before it is exposed to any human reviewer.
   - **Encroachment Detection:** Spatial-join adjacent parcels; construct an overlap graph (parcels = nodes, overlaps = edges) to cluster multi-party disputes.

3. **Confidence Scoring & Fatigue-Equivalent Routing:**
   - Each extracted polygon carries a **per-region confidence score**.
   - Polygons above a configurable confidence threshold route to **provisional approval** (routine spot-check); polygons below threshold route to the **field verification queue** — mirroring a debounced-alert pattern, but for legal risk instead of posture risk.
   - Sustained low confidence across a parcel's revision history (not a single noisy inference) is what triggers a mandatory field visit.

4. **Calibration-Equivalent Baseline (Ground Control):**
   - Each survey batch is anchored against **GNSS/CORS ground control points (GCPs)** captured at known geodetic baselines, playing the same role calibration plays in a sensor pipeline: every relative measurement is validated against a trusted absolute reference before it is trusted.

5. **Interface & Feedback:**
   - **Web-GIS Command Centre** (React + TypeScript, MapLibre GL JS, CesiumJS for 3D) with live parcel symbology, colour-coded confidence flags (green = approved, amber = pending, red = dispute), manual vertex editing, batch approval, and full audit trail.
   - **Offline-capable Field Surveyor App** for GNSS/CORS RTK/PPK ground-truth capture, with sync-on-reconnect and instant AI-vs-ground-truth comparison.
   - No auto-publish: every parcel requires explicit **human sign-off** before it becomes an official record.

---

## System Pipeline (5 Stages)

| # | Stage | What happens |
|---|---|---|
| 01 | **Ingestion** | Cloud-optimized GeoTIFFs + LiDAR point clouds, tiled into model-ready chips; falls back to RGB-only if DSM/DTM is missing for a batch. |
| 02 | **AI Extraction** | Elevation-aware SAM 2 / DeepLabv3+ / U-Net ensemble produces building, parcel, and road masks with a confidence score. |
| 03 | **Validation** | Douglas-Peucker simplification, orthogonalization, and PostGIS `ST_IsValid`/`ST_Overlaps` checks; overlaps route to encroachment triage. |
| 04 | **GIS Review** | Multi-stakeholder visual review on the Web-GIS dashboard; low-confidence parcels are flagged for field visits. |
| 05 | **CORS Verify** | Centimetre-accurate DGPS field sign-off closes the loop; corrections feed back into incremental model retraining. |

---

## Technical Architecture

Modular separation of concerns, mirroring a production geospatial-AI stack:

1. **`ingestion/`** — Raster tiling, radiometric/geometric correction, RGB+DSM/DTM band stacking, chip generation.
2. **`extraction/`** — Model wrapper for SAM 2 / SAMGeo, DeepLabv3+, U-Net (PyTorch, TorchGeo, OpenGeos GeoAI); returns masks + confidence maps.
3. **`topology/`** — Vector math: mask-to-polygon conversion, Douglas-Peucker simplification, orthogonalization, road-centerline extraction (GDAL, Shapely, GeoPandas).
4. **`validation/`** — PostGIS validity gate, spatial-join overlap detection, encroachment graph construction (optional Neo4j store for multi-ULB road-network scale).
5. **`routing/`** — Confidence-threshold logic that assigns each parcel to provisional approval or the field-verification queue; debounced so a single noisy frame doesn't trigger a false flag.
6. **`field-app/`** — Offline-first surveyor client: GNSS/CORS RTK/PPK capture, geo-tagged photos, AI-vs-ground-truth diff, boundary correction submission.
7. **`webgis/`** — React + TypeScript dashboard: MapLibre GL JS (2D), CesiumJS (3D), manual editing, batch approval, audit log, analytics/reports.
8. **`api/`** — FastAPI orchestration layer tying every module together; PostgreSQL/PostGIS for geometry, object storage for rasters.
9. **`export/`** — GDAL/OGR output to Shapefile, GeoJSON, GeoTIFF; ULPIN/Bhu-Aadhaar-ready parcel IDs.

---

## Tech Stack

```
Modeling      : PyTorch, TorchGeo, OpenGeos GeoAI, SAM 2 / SAMGeo, DeepLabv3+, U-Net
Geospatial    : GDAL, Shapely, GeoPandas, PostGIS, Overture Maps base layers
Graph store   : Neo4j (optional, multi-ULB road-network scale)
Backend       : FastAPI (Python), PostgreSQL/PostGIS, Docker, Kubernetes
Frontend      : React, TypeScript, MapLibre GL JS, CesiumJS
Field client  : Offline-first PWA/mobile, GNSS/CORS RTK/PPK integration
Infra         : AWS/GCP (India data-localization compliant), TLS in transit,
                encryption at rest, RBAC, audit logging, GPU inference server
```

---

## Edge Case Handling

- **Missing elevation data:** Falls back to RGB-only segmentation for a batch rather than blocking the pipeline; confidence scores are adjusted downward accordingly.
- **Partial occlusion (cloud cover / shadow):** Affected tiles are auto-flagged low-confidence and routed to field verification instead of silently accepting a bad mask.
- **GNSS signal loss in the field:** The surveyor app queues captured points locally and syncs on reconnect — no data loss on dead zones.
- **Overlapping/disputed parcels:** Never auto-resolved — always routed to a human-reviewed dispute queue with the conflict graph attached.
- **Camera/sensor or ingestion failure:** Batch-level ingestion errors are logged and re-queued rather than silently dropping tiles from a survey run.

---

## Screenshots / Live Reference

The interactive reference build (static, zero-backend, deterministic mock data) is live at **[roop-rekha.vercel.app](https://roop-rekha.vercel.app/)**, covering all 10 operational modules:

- AI Parcel Extraction · Web-GIS Map Viewer · Topology & Validation
- Encroachment Triage · GNSS Field Verification · Analytics & Reports
- Ingestion · GIS Review · CORS Verify

---

## Status

Built for **Smart India Hackathon 2026** under the Department of Land Resources problem statement. This README documents the intended production architecture; the live Vercel build is a static, frontend-only demo of the Web-GIS and workflow modules with mock data, not the production AI/backend pipeline.
