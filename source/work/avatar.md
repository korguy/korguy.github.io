---
title: Part-Aware 3D Reconstruction of a Clothed Avatar from a Single Image
---

> 👬 **Team**: Hyun Kang, Chang-Seok Song, Kyu-Chul Shim
> 👨🏻‍💻 **Role**: Project Lead 
> 📅 **Date**: Jun 2021 - Dec 2021 

<div class="text-center mb-4">
  <img src="/images/avatar.jpg" alt="adisaktijrs" width="600" />
</div>

### Summary
Our team developed a pipeline to reconstruct 3D avatar of a person (in mesh) from a single view single. In this project, I devised the method, and implemented the code based on the previous work, [PIFu](https://shunsukesaito.github.io/PIFu/). The picture above is the 3D avatar of myself 🤣. 

### Introduction
##### Why? 🧐
With the rise of the metaverse, the importance of personal avatars is also increasing. However, creating a realistic 3D avatar can be costly, as it typically requires expensive equipment like 3D scanners. Recently, AI-based solutions have demonstrated the ability to reconstruct avatars from just a single image. The challenge is that these reconstructed avatars are static, meaning their pose cannot be changed, which significantly limits their applications. Therefore, we believe that avatars should not only be realistic but also animatable.

##### How? 👀
[PIFu](https://shunsukesaito.github.io/PIFu/) has demonstrated that an avatar can be reconstructed from a single view image using a neural network trained on image-mesh pairs. One limitation identified at the time was the fidelity, or quality, of the reconstructed mesh. I believe this issue partly stems from the network architecture, where a single network must learn the complex topology of the human body. This inspired me to consider splitting the network into smaller segments, with each network responsible for learning a specific part of the human body. [IP-Net](https://virtualhumans.mpi-inf.mpg.de/ipnet/) has shown the potential of this approach, although it focused on reconstructing an avatar from a point cloud rather than an image. By determining which part of the mesh corresponds to each human body part, we can use this information to rig the avatar for future animation.

### Experiment
##### Dataset
We needed to collect a dataset of 3D avatars with textures to create a training set. Since commercial data from [RenderPeople](https://renderpeople.com/) was expensive at $70 per mesh, we were able to obtain only 40 meshes. However, we utilized various data augmentation techniques to expand our dataset. We applied background augmentation and, because the meshes were human avatars, we rigged them and altered their poses. This process allowed us to increase our dataset to a total of 294 meshes.

<div class="text-center mb-4">
  <img src="/images/avatar_dataset.jpg" alt="adisaktijrs" width="600" />
</div>

##### Model Architecture
The model was implemented based on both [PIFu](https://shunsukesaito.github.io/PIFu/) and [IP-Net](https://virtualhumans.mpi-inf.mpg.de/ipnet/). The key was to split the network so that each model would learn a part of a body, which is much simpler than as a whole. 

<div class="text-center mb-4">
  <img src="/images/avatar_model.jpg" alt="adisaktijrs" width="600" />
</div>

##### Results
Below are the results. We reconstructed an avatar from a test dataset and animated it to dance 👯. Although the outcome appears promising, the quality of the reconstructed mesh is somewhat inferior to that of PIFu. This discrepancy may be partly due to inconsistent training between parts. During training, we observed that the models for smaller parts converged much more slowly. This issue might be mitigated in the future by applying normalization techniques.

<div class="text-center mb-4">
  <img src="/images/avatar_result.jpg" alt="adisaktijrs" width="400" />
</div>

<div class="text-center mb-4">
<video width="400" height="240" controls>
  <source src="/images/avatar_result.mp4" type="video/mp4">
</video>
</div>

### + We received a grand prize for this capstone project 🤭