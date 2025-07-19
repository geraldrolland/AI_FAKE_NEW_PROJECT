from keras.models import load_model
import os
model = load_model(os.path.join("ai", "CS_model.h5"))