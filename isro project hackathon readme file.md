### Our aim : TO PROVIDE CLEAR IMAGE BY REMOVING CLOUDS FOR LISS-IV IMAGES BY SATELLITE



##### *A SHORT IDEA OF WHAT LISS-IV IMAGE PROCESSING IS:* This LISS stands for Linear Imaging Self-scanning Sensor-IV. This is developed by **ISRO** (yes, be proud) and is the successor or LISS-III. Here, LISS-4 doesn't scan with a moving mirror sweeping back and forth like older scanners. 



Instead, it uses a fixed linear array of **CCD detectors** built around a three-mirror unobscured telescope. Each detector in the array captures one pixel across the swath simultaneously, so an entire line of the image is **grabbed in a single instant**. The satellite's **own forward motion then "pushes" this line forward**, building up the 2D image one row at a time — hence "push-broom." 



In simple words, there's no The sensor has a row of detectors arranged perpendicular to the satellite's motion. Each detector records one pixel in a line across the ground. As the satellite moves forward, new lines are continuously recorded. These lines are combined to form a complete image. These sensors are CCD (Charge-Coupled Device) are sensors that have mini transistors. 



E**very time light falls on it, movement of electrons happens due to photoelectric effect** (jeah that thing back in 11th grade) and a sort-of **energy pit** is created. The fun thing about this is, all the energy now shifts or *is pushed* towards the data-receiver similar to devotees in temple que. Thus the word "pushbroom" mentioned above. The analog signals are converted to digital numbers and stored and/or exchanged. 



The image is taken in terms of 3 signal bands, for RED, GREEN and BLUE, the 3 primary colors. But here's the catch, we're using FALSE COLOR CODING (FCC). Dw, it's a simple concept used to enhance images to get best quality where green is red, and blue is green. I know it's confusing, but trust me, it helps a lot. The following is usually how things appear in FCC


Bright red = healthy vegetation (which is actually green)

Dark black = water (irl is blue)

Cyan/gray = urban regions

Brown/orange = bare soil



Now, since all this is happening, obviously there's some **disturbance**, just like friction opposes motion, **noise** opposes clear transmission of signal. Some of the types of noise are Sensor Noise (Generated inside the CCD detector), **ATMOSPHERIC NOISE(CLOUDS, HAZE, SCATTERING/ABSORPTION OF LIGHT DUE TO ATMOSPHERE),** transmission noise (while transmission), quantization noise (digitalization nalli samasye) and etc. 



Mainly, the issue is caused by air molecules (Rayleigh scattering, thus affecting green and blue bands) and water droplets and **clouds** (non-selective scattering). 
Standard Atmospheric correction includes:-
1. Convert Digital Numbers (DN) → Radiance

&#x09;L=Gain×DN+Offset

2\. Radiance → Top-of-Atmosphere Reflectance

&#x09;	ρ TO A

3\. **Atmospheric Correction : most difficult step.** 


Some of the already existing methods are : Dark Object Subtraction (DOS method) etc etc

Let me tell ya one thing, what we're trying to attempt **cannot be done just with an AI, hence AI has failed**. lol feels good saying that, anyways, moving on.

since traditional AI couldn't accomplish this due to various factors such as -
 Cloud detection is already hard, LISS‑IV’s limited bands make it worse, "

&#x20;Cloud removal” is a physics problem, not just image processing.

&#x20;AI needs data that LISS‑IV mostly doesn’t have

&#x20;Domain shift: models from other sensors do not transfer cleanly

&#x20;label noise and edge cases hurt AI performance and the list is quite long........


Putting it together

For LISS‑IV, AI has not “succeeded effortlessly” because:



1. The sensor provides fine spatial detail but very limited spectral information (only 3 VNIR bands, no SWIR/thermal), so clouds and many land surfaces look almost the same to the model.



2\. Recovering what lies under clouds is an ill‑posed physical inversion problem that requires atmospheric and aerosol information that is not directly in the image.



3\. There is no large, diverse, public, paired cloudy/cloud‑free training dataset for LISS‑IV comparable to what exists for Sentinel‑2/Landsat, which limits how far deep learning can go.



4\. Models still struggle with generalization, label noise, cloud edges, shadows, and confusing cases like snow and bright terrain, especially in VNIR‑only data.


**HOWEVER :)**

**THERE'S A SOLUTION... KIND OF..**

**A QUITE HIGH LEVEL MODEL DU OND CHIKK IDEA-**

**MY SIDE OF TECHNICAL RESEARCH AND IDEAS COMING UP, TILL NOW WAS INFORMATION ABOUT PROJECT RESEARCH AND CONCEPT**
Takes as input:

\->the cloudy LISS‑IV image (FCC bands)

\->a stack of past/future LISS‑IV/AWiFS optical images over the same tile

\->co‑registered SAR images (e.g., Sentinel‑1) that are not affected by clouds.

\->Uses a mean‑reverting diffusion backbone that starts from the cloudy image and iteratively “denoises” it into a cloud‑free prediction, preserving structure while removing clouds.

\->Predicts both the cloud‑free FCC image and a per‑pixel uncertainty map, so you know where the result is reliable.

**in simpler words, this is not the 100% solution, there practically doesn't exist one, for now, but this idea and model is a good solution to an extent. Let's dive deep into it's details and working model and explore our new Eureka!

Chapter 1: defining outputs and inputs**

Input (inference time):

&#x09;Cloudy LISS‑IV tile with 3 bands (G, R, NIR) arranged as FCC (typically NIR‑R‑G).

&#x09;Optional: 2–5 temporally neighboring LISS‑IV/AWiFS images (cloudy or partially cloudy).

&#x09;Optional: Co‑registered Sentinel‑1 SAR image(s) for the same area and dates.



Output:

&#x09;Cloud‑free FCC image on the LISS‑IV grid (same resolution, same bands/order).

&#x09;Pixel‑wise uncertainty map indicating confidence in each pixel.



**Chapter 2: Building a data set** 

&#x09;Collect multi‑temporal LISS‑IV/AWiFS and SAR data over many regions and seasons (agriculture, urban, forest, snow)

&#x09;for each region, build a time series of images (e.g., 6–12 dates within a few months) plus matching Sentinel‑1 SAR tiles amele

&#x09;Use time points where a pixel is (almost) cloud‑free as pseudo‑ground truth, and heavily cloudy dates as inputs; a spatio‑temporal gap‑filling paper shows that using multi‑temporal 	neighbors gives strong reconstructions.

&#x09;Augment this by simulating clouds on clear images (random masks, Perlin‑noise‑based cloud textures, haze overlays) to massively increase supervised examples; diffusion‑based 	cloud‑removal papers routinely use synthetic cloud augmentation.



&#x09;**(this one step svalpa thale nov kelsa but naavu prototype ashte so kammi data set ge train maduva) (idu full backend kelsa so bere avru tension togobedi relax)**

**Chapter 3: Alignment and preprocessing** 

&#x09;**To make the model learn from all sensors and dates, everything must be co‑registered and normalized.**

&#x09;

&#x09;**Geometric alignment:**

&#x09;	**Reproject LISS‑IV, AWiFS, Sentinel‑1, and any auxiliary imagery into the same CRS and pixel grid using GDAL, as is done in SAR–optical fusion studies.**

&#x09;	**Resample coarser images (e.g., AWiFS, Sentinel‑1) onto the 5.8 m LISS‑IV grid (bilinear or bicubic for optical, nearest‑neighbor or bilinear for SAR).**

&#x09;**Radiometric normalization:**

&#x09;	**Convert DN to TOA reflectance or surface reflectance if possible, using available atmospheric correction pipelines; deep AC models like SAAC‑Net show that you can 			approximate physics‑based AC with DL if needed.**

&#x09;	**Standardize each band across the dataset (mean–std normalization), and clip outliers to make training stable, as done in recent deep cloud‑removal work.**



&#x09;**Patch extraction:**

&#x09;	**cut each scene into small patches (e.g., 256×256) with overlap; both atmospheric‑correction and cloud‑removal deep models use patch‑based training to handle large images.**



**Chapter** 4 : **Network Architecture**

&#x09;**4.1 Multi‑branch encoder**

&#x09;**Design three encoders:**



&#x09;	**Cloudy LISS‑IV encoder (main branch):**



&#x09;**A U‑Net or ResNet‑U‑Net that extracts hierarchical features from the cloudy FCC patch.**

&#x09;**Multi‑temporal optical encoder:**

&#x09;**Siamese encoder (shared weights) applied to each temporal neighbor (LISS‑IV/AWiFS).**



&#x09;**Features from all times are stacked and passed through 3D convolutions or temporal attention to fuse information across time, similar to a multi‑temporal cloud‑removal ResNet with 	3D convs.**



&#x09;**SAR encoder:**



&#x09;**(Encoder that processes Sentinel‑1 VV/VH channels and maps them to the same feature space as optical, as done in SAR–optical fusion networks like DSen2‑CR, MFFNet, and PLFM.)**



&#x09;**4.2 Feature fusion module**

&#x09;**Fuse features from the three encoders using an advanced fusion block:**

&#x09;**Multi‑feature fusion:**

&#x09;**Concatenate or sum features and run them through a multi‑feature fusion (MFF) block that learns how to weight SAR vs optical vs temporal features, as in MFFNet.**



&#x09;**Cloud‑aware weighting:**

&#x09;**Use an auxiliary cloud‑probability or cloud‑mask head (on the LISS‑IV branch) to produce a cloud map, and use this to up‑weight SAR and temporal features in cloudy areas, similar	to cloud‑aware SAR fusion.**



&#x09;**(This makes the network rely more on “trustworthy” sensors (SAR or other times) where the main image is clouded.)**



&#x09;**4.3 Diffusion‑style reconstruction head**

&#x09;**Instead of a simple CNN decoder, wrap the reconstruction in a conditional diffusion model:**



&#x09;**(Use a conditional diffusion backbone like DiffCR or IDF‑CR, where the condition is the fused multi‑modal feature map and the starting point is the cloudy image itself.)**



&#x09;**Specifically, adopt a mean‑reverting diffusion idea:**

&#x09;**Forward process: add noise while keeping the cloudy image as the mean distribution (so structure is preserved).**

&#x09;**Reverse process: denoise towards a cloud‑free image while constrained to remain structurally close to the original (roads, fields, rivers stay aligned).**

&#x09;**(This backbone is more stable than GANs and gives better detail preservation, as shown by diffusion‑based cloud‑removal studies.)**



&#x09;**.4 Uncertainty head**

&#x09;**(Attach an additional head that predicts pixel‑wise uncertainty (e.g., variance or confidence), inspired by UnCRtainTS.)**



&#x09;**During training, learn a heteroscedastic regression loss where the network outputs both mean and variance of the predicted reflectance; this lets it express “I’m unsure” in areas 	with no good temporal or SAR support.**



&#x09;**(This is critical when clouds are present in all time points or SAR is noisy.)**



**BORE AGBEDI IT'S ALMOST OVER :)**



**CHAPTER 6: Training strategy**

&#x09;**To make this practical and robust:**

&#x09;**Pre‑train on public datasets:**

&#x09;	**Pre‑train your diffusion backbone and fusion blocks on large multi‑sensor cloud‑removal datasets like SEN12MS‑CR / SEN12MS‑CR‑TS (Sentinel‑1 + Sentinel‑2), where paired 			cloudy/cloud‑free examples exist.**

&#x09;**Domain adaptation to LISS‑IV:**

&#x09;	**Fine‑tune the model on your LISS‑IV+SAR dataset with lower learning rate and a small output adaptation layer that maps internal features to LISS‑IV spectral response.**



&#x09;**Curriculum:**



&#x09;	**Start training on easier cases (thin clouds, partial coverage) and gradually add harder cases (thick clouds, snow confusion), as diffusion methods show better convergence 		when complexity is increased gradually.**

&#x09;**This helps overcome the lack of huge labeled LISS‑IV datasets by leveraging richer Sentinel‑2/Landsat data first.**



**CHAPTER 7: Inference pipeline and FCC output**

&#x09;**At inference time, the system behaves like a black box:**



&#x09;**Input preparation:**

&#x09;	**Take the current cloudy LISS‑IV FCC tile.**

&#x09;	**Fetch N previous/next LISS‑IV/AWiFS tiles and the matching Sentinel‑1 SAR tile(s), resampled to the same grid.**



&#x09;**Forward pass:**

&#x09;	**Run the three encoders, fuse features with the cloud‑aware fusion module, and pass them into the conditional diffusion backbone to iteratively denoise the cloudy image into 		a cloud‑free LISS‑IV‑like image.**



&#x09;**Post‑processing:**

&#x09;	**Rearrange the predicted bands as FCC (NIR as R, R as G, G as B) to match standard false‑color visualization.**	

&#x09;	**Optionally threshold the uncertainty map to mark pixels that should be ignored by downstream algorithms.**

&#x09;	**The output is a standard FCC image (same size/resolution as input) that can replace or complement the original cloudy tile.**



**How this model attacks the earlier limitations**

**Limited spectral bands (no SWIR/thermal)**

&#x09;**You compensate for missing spectral dimensions by adding temporal and SAR dimensions: SAR is insensitive to clouds, and other dates often see the same ground without clouds.**

&#x09;**Spatio‑temporal methods and SAR–optical fusion papers show that combining these extra axes significantly improves reconstruction even when only visible/NIR bands are available.**

**Ill‑posed reconstruction and atmospheric effects**

&#x09;**Diffusion models with mean‑reverting behavior constrain the solution to stay structurally close to the cloudy input, avoiding hallucinated geometry while cleaning radiometry.**

&#x09;**Training on reflectance (or AC‑corrected images) approximates complex physics‑based atmospheric correction using learned mappings, as demonstrated in deep AC models like SAAC‑Net.**

**Lack of large LISS‑IV training data**

&#x09;**Pre‑training on large cloud‑removal datasets (Sentinel‑1/2, Landsat) then fine‑tuning for LISS‑IV is exactly how recent cloud‑removal and atmospheric‑correction models handle 	limited labeled data for a target sensor.**

&#x09;**Synthetic cloud augmentation and multi‑temporal self‑supervision (using future/previous clear dates as targets) further expand training samples.**

**Domain shift between sensors**

&#x09;**Domain‑adaptation layers and fine‑tuning align the feature distributions from Sentinel‑2/Landsat to LISS‑IV spectral response and resolution, as suggested by cross‑sensor AC 	validation studies.**

&#x09;**Multi‑modal diffusion frameworks like SeqDMs are explicitly designed to accept arbitrary sequences and modalities, making them robust to sensor differences when properly trained.**

**Label noise, edges, and shadows**

&#x09;**Global–local losses and cloud‑aware loss weighting focus learning on cloud‑covered and edge regions, similar to how spatio‑temporal patch networks and cloud‑aware fusion methods 	improve performance on hard areas.**

&#x09;**The uncertainty head (as in UnCRtainTS) lets the model “admit uncertainty” in extremely ambiguous pixels instead of confidently outputting wrong values, which is safer for 	downstream tasks.**


















&#x09;​





