// IMPORTS
import "./bootstrap"
import "./keen"
import "./other"
import "fslightbox"

import bsCustomFileInput from 'bs-custom-file-input'
import {DropzoneInitializator} from "./components/Dropzone"

// CODE
bsCustomFileInput.init()
new DropzoneInitializator()