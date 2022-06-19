
from rest_framework_extensions.key_constructor.constructors import (
    KeyConstructor 
)
from rest_framework_extensions.key_constructor import bits
from rest_framework_extensions.key_constructor.bits import (
    KeyBitBase,
)
from django.core.cache import cache
from django.apps import apps
from django.utils.encoding import force_str

class ProfileUpdatedAtKeyBit(KeyBitBase):
    def get_data(self,request, **kwargs):
        
        if not request.user.is_authenticated:
            return
        key = f"profile_{request.user.id}"
        value = cache.get(key, None)

        Profile = apps.get_model('novels', 'Profile')
        profile = Profile.objects.filter(user=request.user).first()
        if not value:
            value = profile.user
            cache.set(key, value=value)

        return force_str(value)

class DefaultKeyConstructor(KeyConstructor):
    unique_method_id = bits.UniqueMethodIdKeyBit()
    format = bits.FormatKeyBit()
    all_query_params = bits.QueryParamsKeyBit()

class UserKeyConstructor(DefaultKeyConstructor):
    args_bit = bits.ArgsKeyBit()
    kwargs_bit = bits.KwargsKeyBit()

class DummyConstructor(KeyConstructor):
    unique_view_id = bits.UniqueMethodIdKeyBit()
    format = bits.FormatKeyBit()

class ProfileKeyConstructor(UserKeyConstructor):
    user_pk = bits.UserKeyBit()
    profile_updated = ProfileUpdatedAtKeyBit()