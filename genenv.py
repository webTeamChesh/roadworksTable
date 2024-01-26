import os

def get_config_from_environment(env_content):
    # get config from env
    env_content += "ON_PWD={}\n".format(os.environ.get("ON_PWD", ""))
   
    return env_content


env_content = ""
env_content = get_config_from_environment(env_content)

with open(".env", "w", encoding="utf8") as env:
    env.write(env_content)
