1. What is LISS-IV?

LISS-IV (Linear Imaging Self-Scanning Sensor-IV) is a high-resolution multispectral camera carried by India's Resourcesat satellites developed by Indian Space Research Organisation. It captures images of the Earth's surface in multiple spectral bands.

Key Specifications
Parameter	Value
Full Form	Linear Imaging Self-Scanning Sensor-IV
Satellite	Resourcesat-1, Resourcesat-2, Resourcesat-2A
Spatial Resolution	5.8 meters
Spectral Bands	Green, Red, Near Infrared (NIR)
Swath Width	\~23 km (multispectral mode)
Revisit Period	\~5 days
Sensor Type	Pushbroom Scanner

2. Spectral Bands of LISS-IV

LISS-IV captures information in three bands:

Band	Wavelength (µm)	Use
Green (B2)	0.52–0.59	Vegetation health
Red (B3)	0.62–0.68	Soil and crop analysis
Near Infrared (B4)	0.77–0.86	Vegetation monitoring

Why Multiple Bands?

Different objects reflect different amounts of light:

Water absorbs NIR
Healthy vegetation strongly reflects NIR
Urban areas reflect differently in Red and Green bands

This allows computers to distinguish between forests, buildings, roads, water bodies, and agricultural fields.

3. What is LISS-IV Image Processing?

LISS-IV image processing means applying digital image processing techniques to satellite images to extract useful information.

Workflow
Satellite Data
↓
Preprocessing
↓
Image Enhancement
↓
Classification
↓
Feature Extraction
↓
Analysis \& Mapping
4. Step 1: Image Acquisition

The satellite captures images and stores pixel values.

Example:

Pixel (x,y)

Green = 120
Red   = 80
NIR   = 220

Each pixel contains spectral information.

5. Step 2: Preprocessing

Raw satellite images contain noise and distortions.

A. Geometric Correction

Corrects positional errors.

Example:

Roads and buildings should appear in their actual locations on maps.

B. Radiometric Correction

Removes sensor noise and atmospheric effects.

Example:

Cloud haze can make vegetation appear lighter than it actually is.

C. Image Registration

Aligns multiple images taken at different times.

Used in:

Change detection
Crop monitoring

6. Step 3: Image Enhancement

Improves visual quality.

Contrast Stretching

Makes features easier to identify.

Before:

Pixel values:
100-120

After stretching:

0-255
Histogram Equalization

Distributes brightness levels evenly.

Result:

Better visibility
Improved feature detection
7. Step 4: False Color Composite (FCC)

This is one of the most important concepts.

Instead of displaying:

R = Red
G = Green
B = Blue

LISS-IV often uses:

R = NIR
G = Red
B = Green
Result
Object	FCC Color
Healthy Vegetation	Bright Red
Water	Dark Blue/Black
Urban Area	Cyan/Gray
Bare Soil	Brown

This makes vegetation stand out clearly.

8. Step 5: Image Classification

Classification means assigning each pixel to a category.

Example:

Pixel → Forest
Pixel → Water
Pixel → Building
Pixel → Road
A. Supervised Classification

User provides training samples.

Example:

Select:
Forest Area
Water Area
Urban Area

Algorithms learn patterns and classify the rest.

Common Algorithms:

Maximum Likelihood
Random Forest
SVM (Support Vector Machine)
B. Unsupervised Classification

Computer groups similar pixels automatically.

Example:

Cluster 1
Cluster 2
Cluster 3

User later labels them.

9. NDVI Calculation (Very Important)

NDVI = Normalized Difference Vegetation Index

Used to measure vegetation health.

Formula:

NDVI=
NIR+Red
NIR−Red
​



Using LISS-IV:

NIR = 220
Red = 80
NDVI=
220+80
220−80
​

NDVI=
300
140
​

NDVI=0.47

Interpretation:

NDVI Value	Meaning
<0	Water
0–0.2	Bare soil
0.2–0.5	Moderate vegetation

>0.5	Dense vegetation

Because LISS-IV contains Red and NIR bands, NDVI can be computed directly.

10. Feature Extraction

Used to identify specific objects.

Examples:

Road Extraction

Detect road networks automatically.

Water Body Extraction

Identify:

Lakes
Rivers
Reservoirs
Building Detection

Useful for:

Smart cities
Urban planning
11. Change Detection

Compare images from different dates.

Example:

Image 1 (2020)
Forest Area = 120 km²
Image 2 (2025)
Forest Area = 95 km²

Difference:

Forest Loss = 25 km²

Applications:

Deforestation monitoring
Urban expansion
Flood assessment
12. Software Used for LISS-IV Processing

Popular tools include:

Software	Type
QGIS	Free
ArcGIS	Commercial
ERDAS IMAGINE	Commercial
ENVI	Commercial
Google Earth Engine	Cloud-based
13. Applications of LISS-IV
Agriculture
Crop identification
Crop health monitoring
Yield estimation
Forestry
Forest mapping
Deforestation detection
Urban Planning
Road network mapping
Building extraction
Water Resources
Reservoir monitoring
Watershed analysis
Disaster Management
Flood mapping
Landslide monitoring
Cyclone damage assessment

14. Relation with CSE

As a Computer Science student, LISS-IV processing connects directly with:

Image Processing
Filtering
Enhancement
Segmentation
Machine Learning
Land-cover classification
Crop prediction
Deep Learning
CNNs for satellite image analysis
Object detection
Data Science
NDVI analysis
Environmental analytics
GIS Programming

Using:

Python
OpenCV
GDAL
Rasterio
GeoPandas



alse Color Composite (FCC) and Noise in LISS-IV Images

These are two of the most important concepts in satellite image processing. Understanding them will help you grasp how raw satellite data is converted into useful information.

Part 1: False Color Composite (FCC)
Why Do We Need FCC?

Human eyes can see only the visible spectrum:

Blue   : 0.45 - 0.52 µm
Green  : 0.52 - 0.60 µm
Red    : 0.63 - 0.69 µm

However, satellites like LISS-IV capture information beyond visible light, especially the Near Infrared (NIR) band.

Since humans cannot see NIR, we assign it an artificial color for visualization. This creates a False Color Composite (FCC).

What is a Composite Image?

A digital color image is formed by combining three channels:

Red Channel
Green Channel
Blue Channel

Each channel stores brightness values from 0–255.

Example:

Pixel A

R = 200
G = 150
B = 100

These combine to produce a specific color.

True Color Composite (TCC)

A natural-color image uses:

Red Band   → Red Display
Green Band → Green Display
Blue Band  → Blue Display

Result:

Trees → Green
Water → Blue
Soil → Brown

Looks like what humans see.

Problem

Vegetation differences are difficult to identify accurately.

False Color Composite (FCC)

In FCC, spectral bands are reassigned.

For LISS-IV:

Display Red   ← NIR
Display Green ← Red
Display Blue  ← Green

Mathematically:

RGB Display

R = NIR
G = Red
B = Green

This is the most common FCC arrangement.

Why Assign NIR to Red?

Healthy vegetation reflects enormous amounts of NIR energy.

Example:

Surface	NIR Reflection
Healthy Crops	Very High
Dry Grass	Medium
Water	Very Low

Since vegetation is brightest in NIR:

NIR assigned to Red

Vegetation appears bright red.

This makes plant health easy to observe.

Example Pixel Calculation

Suppose a pixel has:

Green = 40
Red   = 50
NIR   = 220

FCC assignment:

Display Red   = 220
Display Green = 50
Display Blue  = 40

Result:

Bright Red Pixel

Indicating healthy vegetation.

Color Interpretation in FCC
Healthy Vegetation
Green = 60
Red   = 70
NIR   = 240

Appears:

Bright Red

Reason:

High NIR reflection.

Sparse Vegetation
Green = 60
Red   = 80
NIR   = 120

Appears:

Light Red/Pink

Reason:

Moderate NIR reflection.

Water Bodies
Green = 30
Red   = 20
NIR   = 5

Appears:

Dark Blue/Black

Reason:

Water absorbs NIR.

Urban Areas
Green = 100
Red   = 110
NIR   = 120

Appears:

Cyan
Gray
Light Blue

Reason:

Similar reflectance in all bands.

Bare Soil
Green = 90
Red   = 120
NIR   = 140

Appears:

Brown
Tan
Orange

In most FCC images:

Bright red = healthy vegetation
Dark black = water
Cyan/gray = urban regions
Brown/orange = bare soil
FCC Applications
Agriculture

Identify:

Healthy crops
Stressed crops
Crop disease regions
Forestry

Detect:

Dense forests
Deforestation
Forest fires
Water Resources

Detect:

Lakes
Rivers
Reservoirs
Disaster Monitoring
Flood mapping
Drought assessment
Cyclone damage
Part 2: Noise in LISS-IV Images
What is Noise?

Noise is unwanted information that corrupts the original image.

Think of it as:

Useful Signal + Unwanted Disturbance

Mathematically:

Observed Image=Original Image+Noise
Real-Life Analogy

Suppose you're listening to a song:

Song = Signal
Static sound = Noise

Similarly:

Satellite Image = Signal
Sensor Errors = Noise
Sources of Noise

1. Sensor Noise

Generated inside the CCD detector.

Causes:

Electronic fluctuations
Thermal effects
Amplifier errors
2. Atmospheric Noise

Before reaching the satellite:

Sunlight
↓
Atmosphere
↓
Earth
↓
Satellite

Atmosphere causes:

Scattering
Absorption
Haze

Result:

Pixels become distorted.

3. Transmission Noise

Occurs while sending data from satellite to ground station.

Causes:

Communication interference
Bit errors
4. Quantization Noise

During digitization.

Example:

Actual brightness:

145.7

Stored value:

146

Small errors accumulate.

Types of Noise

1. Salt and Pepper Noise

Looks like random white and black pixels.

Example:

0 0 0 255 0
0 0 255 0 0
0 255 0 0 0

Visual appearance:

Pepper = Black dots
Salt   = White dots
Cause
Transmission errors
Faulty sensors
2. Gaussian Noise

Most common noise.

Follows a normal distribution.

f(x)=
σ
2π
​

1
​

e
−
2σ
2
(x−μ)
2
​



Appearance:

Grainy image

Caused by:

Sensor electronics
Thermal noise
3. Speckle Noise

Common in radar imagery.

Appears as:

Granular pattern

Less significant in LISS-IV optical imagery.

4. Striping Noise

Very important in pushbroom sensors.

Remember:

LISS-IV uses a pushbroom scanner.

Many CCD detectors are arranged in a line:

CCD1 CCD2 CCD3 CCD4 ...

If one detector behaves differently:

Dark line
Bright line

appears in the image.

This is called:

Striping
Banding
Noise Removal Techniques
Mean Filter

Averages neighboring pixels.

Kernel:

1 1 1
1 1 1
1 1 1

Effect:

Noise ↓
Blur ↑
Median Filter

Most popular for salt-and-pepper noise.

Example:

20 21 22
23 255 24
25 26 27

Sorted:

20 21 22 23 24 25 26 27 255

Median:

24

Replace 255 with 24.

Noise removed.

Gaussian Filter

Removes Gaussian noise smoothly.

Kernel example:

1 2 1
2 4 2
1 2 1

Produces natural smoothing.

Adaptive Filters

Adjust filtering based on local image characteristics.

Used in advanced remote sensing applications.

Relationship Between FCC and Noise

Noise directly affects FCC quality.

Example:

Without Noise
Vegetation → Bright Red
Water → Black
With Noise
Vegetation → Red with random dots
Water → Gray patches

This may lead to:

Wrong NDVI values
Wrong classifications
Incorrect crop analysis

Therefore the typical workflow is:

Raw LISS-IV Image
↓
Noise Removal
↓
Radiometric Correction
↓
FCC Generation
↓
Classification
↓
Analysis



AI has not completely failed at removing cloud interference from LISS-IV images, but it has not yet achieved consistently reliable, operational-grade performance for all situations. Let's examine why.

First: What is the actual problem?

When a cloud covers a region in a LISS-IV image:

Ground Surface
↑
Cloud Layer
↑
Satellite

the sensor receives mostly reflected light from the cloud rather than from the ground.

For thick clouds:

Ground Information ≈ Lost

This is fundamentally different from denoising.

Noise Removal

With noise:

Observed=Signal+Noise

The original signal still exists underneath.

Cloud Obstruction

With thick clouds:

Observed≈Cloud

The ground signal may be completely absent.

AI cannot recover information that was never observed.

Why AI struggles

1. The "Missing Information" Problem

Consider a pixel:

Forest Pixel:
Green = 50
Red   = 40
NIR   = 220

Now suppose a cloud covers it:

Green = 240
Red   = 245
NIR   = 250

The original forest information is gone.

AI must guess:

Forest?
Water?
Cropland?
Road?
Building?

There may be many valid answers.

This is called an ill-posed inverse problem in image reconstruction.

Inverse Problem

2. LISS-IV Has Only Three Spectral Bands

LISS-IV provides:

Green
Red
NIR

Many modern cloud-removal approaches work better with richer spectral information.

For example:

Sentinel-2 has 13 bands.
Landsat 8 has 11 bands.

Additional bands help distinguish:

Thin cloud
Thick cloud
Haze
Water vapor
Surface reflectance

LISS-IV lacks these extra cues.

3. Clouds Are Extremely Variable

Clouds differ in:

Shape
Thickness
Altitude
Brightness
Texture

A model trained on monsoon clouds may perform poorly on:

Cirrus clouds
Convective clouds
Mountain clouds

The variability is enormous.

4. Thin Clouds vs Thick Clouds
Thin Cloud

Some ground information survives.

# Observed

Ground + Cloud Effect

AI can often recover useful information.

Thick Cloud

Ground signal may be nearly zero.

Observed ≈ Cloud Only

AI has nothing to reconstruct from.

It begins hallucinating plausible surfaces.

5. Lack of Ground Truth

Training AI requires:

Cloudy Image
+
Exactly Matching Cloud-Free Image

obtained at nearly the same time.

This is difficult because:

Crops grow
Water levels change
Vehicles move
Shadows shift

Even a few days can introduce genuine surface changes.

The AI may learn incorrect mappings.

6. Spatial Resolution Makes It Harder

LISS-IV resolution:

5.8 m

At this scale:

Small roads
Individual trees
Narrow canals
Building edges

become important.

AI must reconstruct fine details.

A mistake of only a few pixels can significantly affect:

Land-use classification
Crop mapping
Urban analysis
7. Temporal Change Problem

Most cloud-removal systems use another image from a different date.

Example:

June Image → Cloudy
May Image  → Clear

AI uses May to predict June.

But what if:

Field harvested
New building constructed
Flood occurred

Then the reference image is outdated.

The model may reconstruct something that no longer exists.

Why Traditional Methods Also Fail

Before AI, researchers used:

Interpolation

Fill missing pixels from neighbors.

Problem:

Large cloud regions become blurry.

Temporal Replacement

Use old images.

Problem:

Real changes are lost.

Multi-sensor Fusion

Combine data from multiple satellites.

Problem:

Different sensors have:

Different resolutions
Different spectral bands
Different viewing angles

Alignment becomes difficult.

What Modern AI Does

Modern systems use:

CNNs

Convolutional Neural Network

Learn spatial patterns.

GANs

Generative Adversarial Network

Generate realistic cloud-free imagery.

Problem:

Can create visually convincing but incorrect ground features.

Transformers

Vision Transformer

Capture long-range spatial relationships.

Still limited when information is completely hidden.

Multi-temporal Networks

Use images from several dates:

April
May
June
July

to infer the obscured region.

Usually more accurate than single-image methods.

The Fundamental Limitation

The biggest reason AI struggles is not computing power.

It is information theory.

Imagine:

100 km² region
covered by thick cloud

The satellite records:

Cloud Reflectance

but not:

Roads
Buildings
Trees
Water

No AI can recover information that was never measured.

At best it can estimate probabilities.

This is why researchers often distinguish between:

Cloud Removal

Removing visible cloud artifacts.

and

Surface Reconstruction

Estimating what is underneath.

The second task is much harder.

What Could Work Better?

A promising future approach for LISS-IV would combine:

LISS-IV Image
+
Previous LISS-IV Images
+
SAR Radar Data
+
Digital Elevation Models
+
Physics-Based Atmospheric Models
+
Transformer Networks

Why SAR?

Radar from sensors such as Sentinel-1 can penetrate clouds and collect information even during cloudy conditions.

The AI would then be constrained by actual measurements rather than purely guessing.

The key takeaway

AI is excellent at detecting clouds, removing haze, and reconstructing partially obscured regions.
It struggles with thick cloud cover in LISS-IV imagery because the underlying ground information is often completely absent,
and no machine learning model can reliably recreate information that was never captured by the sensor in the first place.
The limitation is not mainly AI—it is the physics of image acquisition.





Deep Denoisers (Deep Learning-Based Denoising)
Simple Idea

Instead of manually defining filtering rules, a neural network learns:

"What does a clean image look like?"

and

"What does noise look like?"

The model then removes the noise automatically.

Workflow

Training stage:

Noisy Image
↓
Neural Network
↓
Clean Image

The network learns the mapping.

During Use
New Noisy Image
↓
Trained Network
↓
Denoised Image
Common Deep Denoisers
Autoencoders

Structure:

Noisy Image
↓
Encoder
↓
Compressed Features
↓
Decoder
↓
Clean Image

The network learns essential image information and discards noise.

CNN-Based Denoisers

Examples:

DnCNN
FFDNet
RIDNet

These use convolutional layers to detect spatial patterns.

Transformer-Based Denoisers

Modern systems use transformers to understand long-range image relationships.

Examples include:

Restormer
SwinIR

These are state-of-the-art for many denoising tasks.

Advantages of Deep Denoisers

✔ Preserve edges

✔ Preserve textures

✔ Remove complex noise

✔ Better than classical filters in most cases

✔ Adaptable to many sensors

Disadvantages

✖ Require training data

✖ Computationally expensive

✖ Need GPUs for large images

✖ May hallucinate details if poorly trained

Remote Sensing Example

Suppose a hyperspectral image contains:

Atmospheric noise
Detector noise
Striping noise

A deep denoiser can learn from thousands of clean/noisy examples and remove multiple noise types simultaneously while preserving vegetation boundaries.



NDVI (Normalized Difference Vegetation Index)

NDVI is one of the most important vegetation indices used in remote sensing to measure the health, density, and greenness of vegetation.

It uses two spectral bands:

Red Band (R): Vegetation absorbs red light for photosynthesis.
Near Infrared Band (NIR): Healthy vegetation strongly reflects NIR radiation.
NDVI Formula
NDVI=
NIR+Red
NIR−Red
​

Why this works

Healthy plants:

Absorb most red light → low Red value
Reflect much NIR light → high NIR value

Therefore:

NIR>Red

which gives a high positive NDVI.

NDVI Value Range

Theoretical range:

−1≤NDVI≤+1
Interpretation
NDVI Value	Surface Type
-1 to 0	Water, clouds, snow
0 to 0.1	Bare soil, rocks, sand
0.1 to 0.3	Sparse vegetation
0.3 to 0.6	Moderate vegetation
0.6 to 0.9	Dense healthy vegetation
Examples
Water

Red = 20
NIR = 10

NDVI=
10+20
10−20
​

=
30
−10
​

=−0.33

Result: Water body.

Healthy Crop

Red = 30
NIR = 150

NDVI=
150+30
150−30
​

=
180
120
​

=0.67

Result: Dense healthy vegetation.

What is Noise?

In remote sensing, noise is unwanted variation in pixel values that does not represent the actual ground conditions.

Sources of noise include:

Sensor electronics
Atmospheric scattering
Clouds and haze
Transmission errors
Detector imperfections in CCD arrays
Example

Actual pixel value:

Red = 30
NIR = 150

Due to noise:

Red = 40
NIR = 140

The values no longer represent the true surface reflectance.

How Noise Affects NDVI

Since NDVI depends directly on Red and NIR values, any error in these bands changes the NDVI result.

Case 1: True NDVI

Red = 30

NIR = 150

NDVI=
150+30
150−30
​

=0.67
Case 2: Noisy Data

Red = 40

NIR = 140

NDVI=
140+40
140−40
​

=
180
100
​

=0.56

NDVI decreased from:

0.67 → 0.56

The vegetation may falsely appear less healthy.

Types of Noise Affecting NDVI

1. Random Noise

Pixel values fluctuate unpredictably.

Effects:

Grainy NDVI image
Reduced accuracy
Difficult classification
2. Striping Noise

Common in pushbroom sensors like LISS-IV.

Some CCD detectors respond differently than others.

Result:

Healthy vegetation
||||||||||||||
||||||||||||||

appears as:

Light strip
Dark strip
Light strip
Dark strip

NDVI map shows artificial stripes.

3. Atmospheric Noise

Dust, haze, smoke, and water vapor alter Red and NIR reflectance.

Effects:

NDVI may be underestimated
Vegetation health may appear poorer than reality
4. Salt-and-Pepper Noise

Random bright and dark pixels appear.

Effects:

Scattered abnormal NDVI values
Poor visual quality
Why NDVI is Sensitive to Noise

Notice the denominator:

NIR+Red

When Red and NIR values are small, even a tiny noise value can significantly change NDVI.

For example:

True values:

Red = 5
NIR = 10
NDVI=0.33

Add only ±2 units of noise:

Red = 7
NIR = 8
NDVI=0.07

A small sensor error causes a large NDVI change.

Noise Reduction Before NDVI Calculation

Remote sensing analysts usually perform:

Radiometric Correction
Removes sensor-related errors.
Atmospheric Correction
Removes haze and atmospheric effects.
Destriping
Corrects CCD detector variations.
Filtering
Mean filter
Median filter
Adaptive filter

These steps improve NDVI accuracy.

