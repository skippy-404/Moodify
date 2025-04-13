import axios from 'axios';

const BASE_URL = 'http://localhost:7860/sdapi/v1';

export const img2imgRequest = async (params) => {
  const defaultParams = {
    prompt: "",
    negative_prompt: "",
    styles: ["string"],
    seed: -1,
    subseed: -1,
    subseed_strength: 0,
    seed_resize_from_h: -1,
    seed_resize_from_w: -1,
    sampler_name: "Euler a",
    scheduler: "string",
    batch_size: 1,
    n_iter: 1,
    steps: 50,
    cfg_scale: 7,
    width: 512,
    height: 512,
    restore_faces: true,
    tiling: true,
    do_not_save_samples: false,
    do_not_save_grid: false,
    eta: 0,
    denoising_strength: 0.75,
    s_min_uncond: 0,
    s_churn: 0,
    s_tmax: 0,
    s_tmin: 0,
    s_noise: 0,
    override_settings: {},
    override_settings_restore_afterwards: true,
    refiner_checkpoint: "string",
    refiner_switch_at: 0,
    disable_extra_networks: false,
    firstpass_image: "string",
    comments: {},
    init_images: ["string"],
    resize_mode: 0,
    image_cfg_scale: 0,
    mask: "string",
    mask_blur_x: 4,
    mask_blur_y: 4,
    mask_blur: 0,
    mask_round: true,
    inpainting_fill: 0,
    inpaint_full_res: true,
    inpaint_full_res_padding: 0,
    inpainting_mask_invert: 0,
    initial_noise_multiplier: 0,
    latent_mask: "string",
    force_task_id: "string",
    sampler_index: "Euler",
    include_init_images: false,
    script_name: "string",
    script_args: [],
    send_images: true,
    save_images: false,
    alwayson_scripts: {},
    infotext: "string"
  };

  const finalParams = { ...defaultParams, ...params };

  try {
    const response = await axios.post(`${BASE_URL}/img2img`, finalParams);
    return response.data;
  } catch (error) {
    console.error('Img2img API error:', error);
    throw error;
  }
}; 