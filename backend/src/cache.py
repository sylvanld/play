import pickle


def local_cache(filename):
    """
    Function to save computed value locally and
    later load them from cache.
    """
    try:
        with open(filename, 'rb') as file:
            cached = pickle.load(file)
    except FileNotFoundError:
        cached = {}

    def external_wrapper(func):
        def internal_wrapper(arg):
            if cached.get(arg) is None:
                print('loading from cache')
                cached[arg] = func(arg)

                with open(filename, 'wb') as file:
                    pickle.dump(cached, file, protocol=pickle.HIGHEST_PROTOCOL)
                
            return cached[arg]
        return internal_wrapper

    return external_wrapper
