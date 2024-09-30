using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;

namespace PsExcercise;

public abstract class AAuthorizeAttribute : Attribute, IAuthorizationFilter {
    
    public abstract void CheckAuthorization(AuthorizationFilterContext context, User user);

    public void OnAuthorization(AuthorizationFilterContext context) {
        try {
            CheckAuthorization(context, context.HttpContext.Request.GetLoggedUser());
        }

        catch (UnauthorizedAccessException) {
            context.Result = new UnauthorizedResult();
        }
    }
}

public class AuthorizeAllAttribute : AAuthorizeAttribute {
    public override void CheckAuthorization(AuthorizationFilterContext context, User user) {}
}

public class AuthorizeUserAttribute : AuthorizeAllAttribute {
    public override void CheckAuthorization(AuthorizationFilterContext context, User user) {
        base.CheckAuthorization(context, user);

        if(user == null)
            throw new UnauthorizedAccessException();
    }
}
