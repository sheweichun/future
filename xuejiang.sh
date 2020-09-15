git filter-branch  -f --commit-filter '
        if [ "$GIT_AUTHOR_EMAIL" = "luodan@luodanmac.local" ];
       then
                GIT_AUTHOR_NAME="weichun.swc";
                GIT_AUTHOR_EMAIL="weichun.swc@alibaba-inc.com";
                git commit-tree "$@";
        else
                git commit-tree "$@"; 
fi' -- master
                  
