import os
from pathlib import Path

# Check if the static folder has been created by the webapp build step
if not (Path(__file__).absolute().parent / 'static').exists():
  print('WARNING: static directory does not exist in module root. Build the webapp to populate this directory.')
